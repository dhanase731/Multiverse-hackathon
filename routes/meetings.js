import { Router } from 'express';
import {
  startMeeting,
  receiveChunk,
  endMeeting,
  getAllMeetings,
  getMeetingById,
  getActiveMeeting,
} from '../controllers/meetingController.js';

const router = Router();

router.post('/start',  startMeeting);
router.post('/chunk',  receiveChunk);
router.post('/end',    endMeeting);
router.get('/active',  getActiveMeeting);
router.get('/',        getAllMeetings);
router.get('/:id',     getMeetingById);

export default router;
