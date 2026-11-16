import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main style={{ maxWidth: 360, margin: '80px auto', padding: 16 }}>
      <h1>ログイン</h1>
      {error && <p style={{ color: 'crimson' }}>メールアドレスまたはパスワードが違います</p>}
      <form action={login} style={{ display: 'grid', gap: 12 }}>
        <input name="email" type="email" placeholder="メールアドレス" required autoComplete="email" />
        <input name="password" type="password" placeholder="パスワード" required autoComplete="current-password" />
        <button type="submit">ログイン</button>
      </form>
    </main>
  )
}
