import axios from 'axios'
import { IProfile } from '../src/types'

const serverUrl = 'http://localhost:3001'

describe('Balances integration test ', () => {
  describe('Balances REST API', () => {
    it('POST /balances/deposit/:userId deposit for a valid client less than 25% jobs to pay', async () => {
      const headers = { profile_id: 4 }
      const data = { amount: 20 }

      const response = await axios.post<IProfile>(`${serverUrl}/balances/deposit/4`, data, { headers })
      expect(response.status).toBe(200)
      expect(response.data.id).toBe(4)
      expect(response.data.balance).toBe(21.3)
    })

    it('POST /balances/deposit/:userId deposit for a contractor id', async () => {
      const headers = { profile_id: 7 }
      const data = { amount: 100 }

      try {
        await axios.post(`${serverUrl}/balances/deposit/7`, data, { headers })
      } catch (error) {
        expect(error.response.status).toBe(400)
      }
    })

    it('POST /balances/deposit/:userId deposit for a valid client more than 25% jobs to pay', async () => {
      const headers = { profile_id: 4 }
      const data = { amount: 51 }

      try {
        await axios.post<number[]>(`${serverUrl}/balances/deposit/7`, data, { headers })
      } catch (error) {
        expect(error.response.status).toBe(400)
      }
    })
  })
})
