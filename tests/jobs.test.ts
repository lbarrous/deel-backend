import axios from 'axios'
import { IJob } from '../src/types'

const serverUrl = 'http://localhost:3001'

describe('Jobs integration test ', () => {
  describe('Jobs REST API', () => {
    it('GETs /jobs/unpaid for a valid Client ID', async () => {
      const headers = { profile_id: 2 }

      const response = await axios.get<IJob[]>(`${serverUrl}/jobs/unpaid`, { headers })
      expect(response.status).toBe(200)
      expect(response.data.length).toBe(2)
      expect(response.data[0].paid).toBe(null)
      expect(response.data[0].description).toBe('work')
      expect(response.data[0].Contract.id).toBe(3)
      expect(response.data[0].Contract.ClientId).toBe(2)
    })

    it('GETs /jobs/unpaid for a valid Contractor ID', async () => {
      const headers = { profile_id: 7 }

      const response = await axios.get<IJob[]>(`${serverUrl}/jobs/unpaid`, { headers })
      expect(response.status).toBe(200)
      expect(response.data.length).toBe(2)
      expect(response.data[0].paid).toBe(null)
      expect(response.data[0].description).toBe('work')
      expect(response.data[0].Contract.id).toBe(4)
      expect(response.data[0].Contract.ContractorId).toBe(7)
    })

    it('GETs /jobs/unpaid for a valid Client ID without jobs', async () => {
      const headers = { profile_id: 3 }

      const response = await axios.get<IJob[]>(`${serverUrl}/jobs/unpaid`, { headers })
      expect(response.status).toBe(200)
      expect(response.data.length).toBe(0)
    })

    it('POST /jobs/:job_id/pay for a valid Job ID and client without balance', async () => {
      const headers = { profile_id: 4 }

      try {
        await axios.post<number[]>(`${serverUrl}/jobs/5/pay`, {}, { headers })
      } catch (error) {
        expect(error.response.status).toBe(422)
      }
    })

    it('POST /jobs/:job_id/pay Concurrent tests for valid jobs', async () => {
      const headers1 = { profile_id: 7 }
      const headers2 = { profile_id: 1 }

      const request1 = axios.post<number[]>(`${serverUrl}/jobs/4/pay`, {}, { headers: headers1 })
      const request2 = axios.post<number[]>(`${serverUrl}/jobs/2/pay`, {}, { headers: headers2 })
      const response1 = await request1
      const response2 = await request2

      expect(response1.status).toBe(200)
      expect(response2.status).toBe(200)
    })

    it('POST /jobs/:job_id/pay for a valid Job ID and not valid client ID', async () => {
      const headers = { profile_id: 1 }

      try {
        await axios.post<number[]>(`${serverUrl}/jobs/4/pay`, {}, { headers })
      } catch (error) {
        expect(error.response.status).toBe(404)
      }
    })
  })
})
