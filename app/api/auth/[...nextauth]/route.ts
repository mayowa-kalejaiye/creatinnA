import { handlers } from "@/lib/auth"

export const GET = async (request: Request, context: any) => {
	const params = await context.params
	return (handlers as any)(request, { ...context, params })
}

export const POST = async (request: Request, context: any) => {
	const params = await context.params
	return (handlers as any)(request, { ...context, params })
}
