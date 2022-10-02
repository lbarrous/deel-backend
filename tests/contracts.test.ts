import { ContractStatus, IContract } from '../src/types'
import axios from 'axios';

const serverUrl = 'http://localhost:3001';

describe('Contracts integration test ', () => {
  describe('Contracts REST API', () => {
    it('GETs /contracts/:id a valid contract and valid profile', async () => {
      const headers = { profile_id: 1 };

      const response = await axios.get<IContract>(`${serverUrl}/contracts/1`, { headers });
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('terminated');
      expect(response.data.terms).toBe('bla bla bla');
      expect(response.data.ClientId).toBe(1);
      expect(response.data.ContractorId).toBe(5);

    });

    it('GETs /contracts/:id a valid contract and invalid profile', async () => {
      const headers = { profile_id: 2 };

      try {
        await axios.get<IContract>(`${serverUrl}/contracts/1`, {
          headers
        });
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
    });

    it('GETs /contracts/:id a invalid contract', async () => {
      const headers = { profile_id: 1 };

      try {
        await axios.get<IContract>(`${serverUrl}/contracts/2301`, {
          headers
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('GETs /contracts/:id a malformed url', async () => {
      const headers = { profile_id: 1 };

      try {
        await axios.get<IContract>(`${serverUrl}/contracts/321/12`, {
          headers
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
        
      }
    });

    it('GET all contracts /contracts/ a for a valid Client ID', async () => {
      const headers = { profile_id: 1 };
      const response = await axios.get<IContract[]>(`${serverUrl}/contracts`, {
        headers
      });

      expect(response.data.length).toBe(1);
      expect(response.data[0].ClientId).toBe(1);
      expect(response.data[0].ContractorId).toBe(6);
      expect(response.data[0].status).toBe(ContractStatus.IN_PROGRESS);
    });

    it('GET all contracts /contracts/ a for a valid Contractor ID', async () => {
      const headers = { profile_id: 7 };
      const response = await axios.get<IContract[]>(`${serverUrl}/contracts`, {
        headers
      });

      expect(response.data.length).toBe(3);
      expect(response.data[0].status).toBe(ContractStatus.IN_PROGRESS);
    });

    it('GET all contracts /contracts/ a for a invalid profile', async () => {
      const headers = { profile_id: 71 };

      try {
        await axios.get<IContract[]>(`${serverUrl}/contracts`, {
          headers
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });
});