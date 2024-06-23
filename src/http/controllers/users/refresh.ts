import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d', // 7 days
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/', // all backend routes have access
      secure: true, // encrypted with HTTPS
      sameSite: true, // accessed only by this application
      httpOnly: true, // accessed only from the backend
    })
    .status(200)
    .send({ token })
}
