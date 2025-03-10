import jwt from 'jsonwebtoken'
export const signToken = ({
  payload,
  privateKey = process.env.SECRET_KEY as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  SECRET_KEY = process.env.SECRET_KEY as string
}: {
  token: string
  SECRET_KEY?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
      if (error) reject(error)
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
