const fs = require('fs')
const workflow = JSON.parse(fs.readFileSync('d:/Multiverse hackathon/Email-relpy assistance/n8n_workflow.json', 'utf8'))
const credNodes = workflow.nodes.filter(n => n.credentials)
console.log('Nodes with credentials:')
credNodes.forEach(n => {
  console.log(`Node: ${n.name} (${n.type}) -> credentials:`, JSON.stringify(n.credentials))
})
