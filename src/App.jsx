import { useEffect , useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  
  const [imageData, setImageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [banList, setBanList] = useState([])
  const [history, setHistory] = useState([])

  const API_KEY = import.meta.env.VITE_APP_API_KEY
  const BASE_URL = 'https://api.thedogapi.com/v1/images/search/'

  //Fetch data from API
  const fetchData = async () => {
    setLoading(true)
    try {
      let data = null

      while (!data || (banList.includes(data.breeds && data.breeds[0]?.id))) {
        const response = await axios.get(BASE_URL, {
          headers: {
          'x-api-key': API_KEY,
          },
          params: {
            limit: 5,
            has_breeds: 1,
          },
        })
        data = response.data[0]
      }

      setImageData(data)

      setHistory((prevHistory) => [data, ...prevHistory])
    
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBan = (attribute) => {
    setBanList((prevBanList) => {
      if (prevBanList.includes(attribute)) {
        
        //remove already banned item
        return prevBanList.filter((item) => item !== attribute)
      } else {
        
        //add banned item if not already
        return [...prevBanList, attribute]
      }
    })
  }
  
  return (
      <div className="App">
        <h1>Discover New Things</h1>
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Discover'}
        </button>

        {imageData && (
          <div>
            <img src={imageData.url} alt="Random Dog" width="300" />
            <p
              onClick={()=> toggleBan(imageData.breeds && imageData.breeds[0]?.id)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              Breed: {imageData.breeds && imageData.breeds.length > 0 ? imageData.breeds[0].id : 'Information N/A'}
            </p>

            <div>
              <h3>Banned Attributes:</h3>
              <ul>
                {banList.map((item, index) =>(
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div>
          <h3>History:</h3>
          {history.length > 0 ? (
            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  <img src={item.url} alt={`History Dog ${index}`} width="50" />
                  <p>Breed: {item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Not available'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No history available yet.</p>
          )}
        </div>
      </div>
  )
}

export default App
