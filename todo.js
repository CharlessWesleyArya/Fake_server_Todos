//1st way to get values from form data.
/* const titleField=document.querySelector('#title');
const descriptionField=document.querySelector('#description')
const buttonField=document.querySelector('#btn');
 
buttonField.addEventListener('click',function(){
    console.log(titleField.value+"  "+descriptionField.value)
}) */

//2nd way to get values from Form Data.
//we have these basic requests or end points with server.
/* 
    @GET http://localhost:3000/todos
    @POST http://localhost:3000/todos/1 {}
    @PATCH http://localhost:3000/todos/1 {}
    @PUT http://localhost:3000/todos/1 {}
    @DELETE http://localhost:3000/todos/1 
 */


var todos = [];
let isEdit = false;
let editId = null;

fetchTodos()
    .then(data => {
        todos = data;
        render(todos);
    })
const todoForm = document.querySelector('#todo_form')
const buttonField = document.querySelector('#btn');

const title = document.querySelector('#title')
const description = document.getElementById('description')

buttonField.addEventListener('click', function () {

    const form = new FormData(todoForm);
    /* for(var val of form.values()){
        console.log(val);
    } */
    var formValues = {}
    for (var key of form.keys()) {
        formValues[key] = form.get(key);
    }

    if (!isEdit) {

        var todo = getTodo(formValues.title, formValues.description);
        {/*this is commented because, we have written getTodo(),
        and this functionality is placed there with shorter form 
        {
        title:formValues.title,
        description:formValues.description,
        createdAt:new Date().toString(),
        status:'active'
    } */}
        createTodos(todo)
            .then(data => {
                todo = { ...todo, id: data.id }
                todos = [...todos, todo];
                render(todos)
            })

    }
    else {
        //edit functionality
        var newTodos = [...todos];
        var idx = newTodos.findIndex(t => t.id == editId)
        var t = { ...newTodos[idx] }
        /*  trying with update function which i have written */
        t.title = formValues.title;
        t.description = formValues.description;
        newTodos[idx] = t;


        updateTodo(editId, t)
            .then(_ => {
                releaseLock();
                todos = newTodos;
                render(todos)
            })

        /* var id=idx+1;
        updateTodo(id)
            .then(data => {
                releaseLock();
                todos = newTodos;
                console.log(todos)
            }) */

    }
    title.value = null;
    description.value = null;

})
function editLock(id) {
    editId = id;
    isEdit = true;
    buttonField.textContent = 'Save'


}
function releaseLock() {
    editId = null;
    isEdit = false;
    btn.textContent = "Add Todo"

}
/* we can write html code in js like this and this will be converted to html according to the given structure.

 function makeItem(title,description,status){
    const outerRow=document.createElement('div');
    outerRow.classList.add(['row','jumbotron','section']);

    const titleDiv=document.createElement('div');
    titleDiv.classList.add('col-md-2');
    titleDiv.textContent=title;
    outerRow.appendChild(titl)
} */
function getTodo(title, description) {
    //if the key and value are same then we can write like the below code.
    //js will keep the code like title:title;
    /* we have to extract the last element id and +1 to it and this will be our new Id */
    /* fetch will take care of it ,so we commented this var id;
    if (todos.length == 0) id = 1;
    else {
        var last = todos[todos.length-1] //length()
        id = last.id + 1;
    } */
    return {
        title,
        description,
        status: "Active",
        createdAt: new Date().toString()
    }
}


function render(todos) {
    const todo_list = document.querySelector('.todo_list')
    const items = todos.map(todo => renderTodoItem(todo))

    //clear the todos that already the page is showing.
    todo_list.innerHTML = null;

    items.forEach(item => {
        todo_list.appendChild(item)
    });
}

function renderTodoItem(todo) {
    const mainRow = document.createElement('div');
    mainRow.className = 'row jumbotron section';

    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    const statusDiv = document.createElement('div');
    titleDiv.className = 'col-md-2';
    titleDiv.textContent = todo.title;
    descriptionDiv.className = 'col-md-3';
    descriptionDiv.textContent = todo.description;
    statusDiv.className = 'col-md-2';
    statusDiv.textContent = todo.status;

    let markCompleted = document.createElement('div');
    markCompleted.className = 'col-md-2';

    let statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-success';
    statusBtn.textContent = 'mark Completed';

    statusBtn.addEventListener('click', () => {
        {/* //mutable way
        var t=todos.find(t=> t.id== todo.id);
        t.status="Completed";
        render(todos) */}

        //immutable way
        var newTodos = [...todos];
        var idx = newTodos.findIndex(t => t.id == todo.id);
        var t = { ...newTodos[idx] };
        t.status = "Completed";
        newTodos[idx] = t;
        todos = newTodos;
        updateTodo(todo.id, t)
            .then(_ => {
                render(todos)
            })
    })

    markCompleted.appendChild(statusBtn);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'col-md-3';

    const row = document.createElement('div');
    row.className = 'row';

    let editDiv = document.createElement('div');
    editDiv.className = 'col-md-3';

    statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-primary';
    statusBtn.textContent = 'Edit';

    statusBtn.addEventListener('click', function () {
        title.value = todo.title;
        description.value = todo.description;
        editLock(todo.id)
    })

    editDiv.appendChild(statusBtn);

    row.appendChild(editDiv)

    let statusAction = document.createElement('div');
    statusAction.className = 'col-md-3';

    statusBtn = document.createElement('button');
    statusBtn.className = 'btn btn-danger';
    statusBtn.textContent = 'Delete';
    statusBtn.addEventListener('click', () => {
        //Immutable way
        var newTodos = todos.filter(t => t.id != todo.id);
        deleteTodo(todo.id)
            .then(_ => {
                todos = newTodos
                render(newTodos)
            })
    })

    statusAction.appendChild(statusBtn);

    row.appendChild(statusAction)

    actionsDiv.appendChild(row)

    mainRow.appendChild(titleDiv)
    mainRow.appendChild(descriptionDiv)
    mainRow.appendChild(statusDiv)
    mainRow.appendChild(markCompleted)
    mainRow.appendChild(actionsDiv)

    return mainRow;

}
//if server this is not there than we are calling render here
//render(todos);