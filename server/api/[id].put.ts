import { setConversation } from "../utils/storage"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id ?? "undefined"
  const body = await readBody(event)

  if (typeof body === "string") {
    const text = sanitizeStatusMessage(body)
    setConversation(id, [{ text }])
    return { id, text }
  }

  if (!body.text) {
    throw createError({ statusCode: 400, message: "Missing text attribute" })
  }
  
  const text = sanitizeStatusMessage(body.text)
  const name = sanitizeStatusMessage(body.name)
  const metadata = sanitizeStatusMessage(body.metadata)

  if (!body.type || !["left", "right"].includes(body.type)) {
    throw createError({ statusCode: 400, message: "Attribute type must be left or right" })
  }

  setConversation(id, [{ text, name, type: body.type }], metadata)
  return { id, text, name, type: body.type, metadata }
})