export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="grid place-content-center">{children}</div>;
}
