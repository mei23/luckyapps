
// StatusX一覧

import StatusEx from '../components/StatusEx'

export default (props) => {
  const stxs = props.stxs
  const host = props.host

  return (
    <div>
      {stxs
        .filter(x => !x.hidden) // 非表示のぞく
        .map(stx => (
          
          // event/original/pend
          stx.event == 'pend' ? (
            <div style={{background:'yellow'}}>表示保留しました</div>
          ) : 

          // event/stream/delete
          stx.event == 'delete' ? (
            <div style={{background:'red'}}>delete {stx.status}</div>
          ) : 

          // event/stream/notification
          stx.event == 'notification' ? (
            <div style={{background:'notification'}}>{JSON.stringify(stx.status)}</div>
          ) : 

          // status
          <StatusEx key={stx.status.id}
            host={host}
            status={stx.status}
            fujo={stx.fujo}
          />
      ))}
    </div>
  )
}

