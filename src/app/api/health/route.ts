export async function GET(): Promise<Response> {
	return Response.json({ ok: true, service: "sl55-compare" }, { status: 200 });
}


