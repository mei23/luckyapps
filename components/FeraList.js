

export default (props) => {
  const inss = props.inss
  return (
    <div className=''>
      <div className='list' style={{
        'max-height': '300px',
        overflow: 'scroll',
        }}>
        {inss.map((ins) => {
          const avgDelay = Math.floor(ins.dly / ins.cnt / 1000)

          return (
          <div className=''>
            <div>平均到着遅延:{avgDelay}秒 / {ins.key} / サンプル数:{ins.cnt}</div>
          </div>
          )}
        )}
      </div>
      <style jsx>{`
      `}</style>
    </div>)
}
