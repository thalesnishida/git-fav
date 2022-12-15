export class GitHubUser {
  static search(userName){
    const enderPoint = `https://api.github.com/users/${userName}`

    return fetch(enderPoint)
      .then(data => data.json())
      .then(({login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}