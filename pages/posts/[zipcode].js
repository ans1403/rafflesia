import useSWR from "swr"
import axios from "axios"

export const getServerSideProps = async (context) => {
  return {
    props: {
      zipcode: context.query.zipcode
    }
  }
}

const Index = props => {

  const { zipcode } = props

  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
  const fetcher = url => axios(url).then(res => res.data)
  const { data, error } = useSWR(url, fetcher)
  const render = content => (
    <>
      <div>
        <h2>郵便番号: {zipcode}</h2>
      </div>
      {content}
    </>
  )

  // データ取得中の処理を記述する

  if (error) return render(<div>failed to load</div>)
  if (!data) return render(<div>loading...</div>)


  // データ取得完了後の処理を記述する

  const { status, message, results } = data

  if (status == 200) {
    const { address1, address2, address3 } = results[0]
    const content = (
      <div>
        <p>住所1: {address1}</p>
        <p>住所2: {address2}</p>
        <p>住所3: {address3}</p>
      </div>
    )
    return render(content)

  } else {
    return render(<div>{message}</div>)
  }
}

export default Index
