export const AuthPage = () => {
  const params = new URLSearchParams(window.location.hash.substring(1))
  const id_token = params.get('id_token')
  if (id_token !== null) {
    window.localStorage.setItem('id_token', id_token)
  }
  const error = params.get('error')
  const error_description = params.get('error_description')
  if (error === null && error_description === null) {
    window.close()
  }
  return <>{`${error}: ${error_description}`}</>
}
