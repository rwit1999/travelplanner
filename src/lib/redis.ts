import Redis from 'ioredis'

const REDIS_URL='rediss://default:Ab6zAAIncDE5N2Q4ZDUzOTQyMTU0YzY3YTI3NjgwYTY1YzUzNDJkMHAxNDg4MTk@tolerant-elephant-48819.upstash.io:6379'

export const connection =new Redis(REDIS_URL,{maxRetriesPerRequest:null})
