import lostCloud from '../assets/404cloud.svg'
import { colors } from '../constants/colors'
import { Link, useParams } from 'react-router-dom'
import { isValidChainName } from '../constants/chainInfo'

export const NotFound404 = () => {
  const { chain } = useParams()

  return (
    <div className="md:flex my-auto mx-auto">
      <img alt="Not found" src={lostCloud}></img>
      <div className="md:mt-24 md:ml-20 text-center md:text-left">
        <h1
          style={{
            fontWeight: '800',
            fontSize: '64px',
            color: colors.gray[200],
          }}
        >
          404
        </h1>
        <p
          style={{
            fontWeight: '400',
            fontSize: '24px',
            color: colors.gray[300],
          }}
        >
          Can't find what you're looking for!
        </p>
        <Link
          to={`/${isValidChainName(chain) ? chain : 'ethereum'}/pool/`}
          className="hover:opacity-100 opacity-80 text-[#4C82FB] py-2 px-2 border border-[#4C82FB] rounded-lg shadow mt-4 inline-flex items-center"
          relative="route"
        >
          <span className="mr-1">Take me back home</span>
          <svg width="16" height="14" viewBox="0 0 16 14" fill="#4C82FB" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893L15.7071 6.29289C16.0976 6.68342 16.0976 7.31658 15.7071 7.70711L9.70711 13.7071C9.31658 14.0976 8.68342 14.0976 8.29289 13.7071C7.90237 13.3166 7.90237 12.6834 8.29289 12.2929L12.5858 8L1 8C0.447716 8 0 7.55229 0 7C0 6.44772 0.447716 6 1 6H12.5858L8.29289 1.70711C7.90237 1.31658 7.90237 0.683418 8.29289 0.292893Z"
              fill="#4C82FB"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
