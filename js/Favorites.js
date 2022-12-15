import { GitHubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
    this.onAdd()
  }

  load() {
    this.entries =  JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  async add(username){
    try {
      const userExist = this.entries.find(entry => entry.login === username)

      if(userExist){
        throw new Error('Usuario ja existe na sua lista')
      }


      const user = await GitHubUser.search(username)
      
      if(user.login === undefined){
        throw new Error('Usuario nao enconstrado')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }     

  }

  delete(user){
    const filteredEntiers = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntiers

    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody');
    this.update()
  }

  update(){
    this.removeAllTr();  
  
  this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;  
      row.querySelector('.user img').alt = `Imagem do ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.name};`
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      this.tbody.append(row)
     
      row.querySelector('.remove').addEventListener('click', () => {
        const isOk = confirm('Você tem certeza que deseja deletar este usúsario?')
        if(isOk){
          this.delete(user)
        }

      })
  })
   


  }
  
  onAdd(){
    const butt = document.querySelector('.search button')
    
    butt.onclick = () => {
      const { value } = document.querySelector('.search input')
      
      this.add(value)
    }
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
          <td class="user">
              <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
              <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
              </a>
            </td>
            <td class="repositories">
              76
            </td>
            <td class="followers">
              9589
            </td>
            <td>
              <button class="remove">remove</button>
          </td>
    `

    return tr
  }

  removeAllTr(){

    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove())
  }
}