// in this file, I will write functions for server

function fetchTodos() {
    return fetch('http://localhost:3000/todos')
        .then((res) => res.json())
        .then(data=>data)
        .catch((err) => {
            console.log(err);
        })
}
function createTodos(data) {
    return fetch('http://localhost:3000/todos', {
        method:'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((data) => data.json)
        .then((data) => data)
        .catch((err) => console.log(err))
}
function deleteTodo(id) {
    return fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
    })
        .then((data) => data.json())
        .then((data) => data)
        .catch((err) => console.log(err))
}
function updateTodo(id){
    return fetch(`http://localhost:3000/todos/${id}`,{
        method:'PATCH'
    })
        .then((data)=>data.json)
        .then((data)=>data)
        .catch((err)=>console.log(err))
}