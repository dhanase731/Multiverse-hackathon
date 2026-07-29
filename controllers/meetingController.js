import Meeting from '../models/Meeting.js';
import { generateLiveNotes, generateFinalSummary } from '../services/groqService.js';

// How many new transcript lines trigger a Groq call
const CHUNK_TRIGGER_INTERVAL = 2;

export async function startMeeting(req, res) {
  try {
    const { meetingId, meetingTitle, userId } = req.body;

    const meeting = await Meeting.create({
      meetingId:    meetingId    || `meet_${Date.now()}`,
      meetingTitle: meetingTitle || 'Sprint Planning',
      userId:       userId       || 'anonymous',
      status:       'LIVE',
      summary:      'Meeting started. Awaiting live transcripts...',
    });

    console.log(`[Meeting] Started: ${meeting.meetingTitle} (${meeting.meetingId})`);
    res.json({ status: 'success', meeting });
  } catch (err) {
    console.error('[startMeeting]', err.message);
    res.status(500).json({ error: 'Failed to start meeting' });
  }
}

export async function receiveChunk(req, res) {
  try {
    const { meetingId, speaker, text, chunkText } = req.body;

    // Support both { speaker, text } and legacy { chunkText }
    const chunkContent = chunkText ?? (speaker && text ? `${speaker}:\n${text}` : null);
    if (!chunkContent?.trim()) {
      return res.status(400).json({ error: 'Missing transcript content' });
    }

    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    // Append to transcript
    meeting.transcript = meeting.transcript
      ? `${meeting.transcript}\n\n${chunkContent}`
      : chunkContent;

    meeting.transcriptLines += 1;

    // Only call Groq every N lines to avoid hammering the API
    const shouldCallGroq = meeting.transcriptLines % CHUNK_TRIGGER_INTERVAL === 0;

    if (shouldCallGroq) {
      const previousNotes = {
        summary:      meeting.summary,
        bulletPoints: meeting.bulletPoints,
        actionItems:  meeting.actionItems,
      };

      const notes = await generateLiveNotes(meeting.transcript, previousNotes);

      if (notes) {
        meeting.summary      = notes.summary;
        meeting.bulletPoints = notes.bulletPoints;
        meeting.actionItems  = notes.actionItems;
      }
    }

    await meeting.save();

    res.json({
      status:       'success',
      summary:      meeting.summary,
      bulletPoints: meeting.bulletPoints,
      actionItems:  meeting.actionItems,
    });
  } catch (err) {
    console.error('[receiveChunk]', err.message);
    res.status(500).json({ error: 'Failed to process chunk' });
  }
}

export async function endMeeting(req, res) {
  try {
    const { meetingId } = req.body;

    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    meeting.status = 'COMPLETED';

    if (meeting.transcript) {
      const finalNotes = await generateFinalSummary(meeting.transcript);

      if (finalNotes) {
        meeting.summary      = finalNotes.summary;
        meeting.bulletPoints = finalNotes.bulletPoints;
        meeting.actionItems  = finalNotes.actionItems;
        meeting.decisions    = finalNotes.decisions;
        meeting.keyPoints    = finalNotes.keyPoints;
      }
    }

    await meeting.save();

    console.log(`[Meeting] Ended: ${meeting.meetingTitle} (${meeting.meetingId})`);
    res.json({ status: 'success', meeting });
  } catch (err) {
    console.error('[endMeeting]', err.message);
    res.status(500).json({ error: 'Failed to end meeting' });
  }
}

export async function getAllMeetings(req, res) {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 }).lean();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
}

export async function getMeetingById(req, res) {
  try {
    console.log('[getMeetingById] Request params ID:', req.params.id);
    const meeting = await Meeting.findOne({ meetingId: req.params.id }).lean();
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
}

export async function getActiveMeeting(req, res) {
  try {
    const meeting = await Meeting.findOne({ status: 'LIVE' }).sort({ createdAt: -1 }).lean();
    res.json({ active: meeting });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active meeting' });
  }
}
