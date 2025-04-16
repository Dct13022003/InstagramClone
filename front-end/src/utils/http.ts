import axios, { type AxiosInstance } from 'axios'
class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdlOTg1MmU4ZWUyN2RlMGNmYWQxNGFkIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoiVW52ZXJpZmllZCIsImlhdCI6MTc0NDgyOTg4MCwiZXhwIjoxNzQ0ODMxNjgwfQ.m9iCby0dHZ2nBUPbAxdLOPFQIy9l7R6xzEkDEknd2G4`
      }
    })
  }
}
const http = new Http().instance
export default http
