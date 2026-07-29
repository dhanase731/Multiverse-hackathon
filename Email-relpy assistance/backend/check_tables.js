const fs = require('fs')
const workflow = JSON.parse(fs.readFileSync('d:/Multiverse hackathon/Email-relpy assistance/n8n_workflow.json', 'utf8'))
const supabaseNodes = workflow.nodes.filter(n => n.type.includes('supabase'))
supabaseNodes.forEach(n => {
  console.log(`Node: ${n.name} (${n.id}) -> table: ${n.parameters.table}, operation: ${n.parameters.operation}`)
})
