import { Service, User, Event } from '@prisma/client'
import db from '../dbConnector'

type Assignment = {
  service: Service
  user: User
  comment: string | null
}

export async function event(id: number) {
  const assignmentsTable = []
  const scheduleTable = []

  const e = await db.Event.getForPdf(id)

  if (!e)
    throw new Error('Could not retrieve data. Possibly id does not exist.')

  e.schedule = await db.Schedule.getForOccasion(e.occasion.id)

  const assignmentGroups: { [key: string]: Assignment[] } = {}

  for (const assignment of e.assignments) {
    const serviceName = assignment.service.name
    if (!Object.keys(assignmentGroups).includes(serviceName))
      assignmentGroups[serviceName] = []
    assignmentGroups[serviceName].push(assignment)
  }

  for (const group of Object.entries(assignmentGroups)) {
    const names: string = group[1].map((a: Assignment) => a.user.name).join(',')
    assignmentsTable.push(`<tr><th>${group[0]}</th><td>${names}</td></tr>`)
  }

  for (const el of e.schedule) {
    const remarksStr =
      el.remarks && el.remarks.length > 0 ? `<br>(${el.remarks})` : ''
    if (el.events.length === 0 || el.events.some((ev: Event) => ev.id === id))
      scheduleTable.push(
        `<tr><th>${el.position}</th><td><b>${el.source} ${el.sourceRef}</b> ${el.title} ${remarksStr}</td></tr>`
      )
  }

  const body = `<div style="width: 14.8cm; min-height: 21cm; background-color: white; padding: 0; margin: 0; overflow:hidden;">

  <div style="padding: 0.7cm 0.8cm">
  <div style="display: flex;">
  <div style="display: inline-block; width: 10cm;">
      <img src="data:image/png;base64,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"
          style="width: 1.8cm; float: left; margin-right: 1cm" />
      <p style="padding-top: 2pt; font-size: 10.5pt">

          <b>Pfarre Namen Jesu</b> <br> www.namenjesu.com
      </p>
  </div>
  <div style="display: inline-block; 
  padding-top: 0cm;">
    <img class="qrcode" src='https://chart.googleapis.com/chart?cht=qr&chl=https%3A%2F%2Flit-dev.namenjesu.org%2Fevents%2F${
      e.id
    }&chs=180x180&choe=UTF-8&chld=L|2' alt=''>
  </div>
</div>
      <div style="margin-top: 0px;">
          <h1>${e.occasion.name}</h1>
          <h5>${e.name} - ${e.date.getDate()}.${
    e.date.getMonth() + 1
  }.${e.date.getFullYear()} ${e.date.getHours()}:${e.date
    .getMinutes()
    .toString()
    .padStart(2, '0')}</h5>
      </div>
      <div style="margin-top: 40px;">
          <h3>Diensteinteilung</h3>
          <table>
              ${assignmentsTable.join('')}
          </table>
      </div>
  </div>
</div>

<div style="width: 14.8cm; min-height: 21cm; background-color: white; padding: 0; margin: 0; overflow:hidden">
  <div style="padding: 0.7cm 0.8cm">
      <div style="margin-top: 10px; min-height: 19cm; overflow:hidden;">
          <h3>Liedplan</h3>
          <table>
             ${scheduleTable.join('')}
          </table>
      </div>
      <div style="font-size: 8pt;">
          Dokument erstellt: ${new Date().toLocaleString()}
      </div>
  </div>
</div>`

  const str = `<html>

<head>
    <title>${e.occasion.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            color: black;
            font-size: 12pt;
        }
        
        table {
            border-spacing: 0.3cm;
            text-align: left;
        }
        
        table th {
            vertical-align: text-top;
        }
        
        .qrcode {
            width: 3cm;
        }
    </style>
</head>

<body>
    ${body}
    
    ${body}
</body>

</html>`
  return { content: str, event: e }
}
