const form = document.querySelector('#form');
const tasks = document.querySelector('#tasks');
const message = document.querySelector('#message');
let editing = null;
let currentPage = 1;
const limit = 10;

function notice(text, ok = false) {
  message.textContent = text;
  message.classList.toggle('ok', ok);
}

async function api(url, options) {
  const result = await fetch(url, options);
  const body = await result.json();
  if (!result.ok) throw new Error(body.mensagem || 'Não foi possível concluir a operação.');
  return body.dados;
}

function resetForm() {
  editing = null;
  form.reset();
  document.querySelector('#form-title').textContent = 'Nova tarefa';
  document.querySelector('#submit').textContent = 'Adicionar tarefa';
  document.querySelector('#cancel').hidden = true;
}

async function load() {
  try {
    const data = await api('/api/tarefa?page=' + currentPage + '&limit=' + limit);
    tasks.replaceChildren();
    document.querySelector('#count').textContent = data.length + ' nesta página';
    document.querySelector('#page').textContent = 'Página ' + currentPage;
    document.querySelector('#previous').disabled = currentPage === 1;
    document.querySelector('#next').disabled = data.length < limit;
    if (!data.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Nenhuma tarefa nesta página.';
      tasks.append(empty);
    }
    for (const task of data) {
      const row = document.createElement('li');
      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = task.titulo;
      const description = document.createElement('p');
      description.textContent = task.descricao;
      details.append(title, description);
      const actions = document.createElement('div');
      actions.className = 'task-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'secondary';
      edit.textContent = 'Editar';
      edit.addEventListener('click', () => {
        editing = task.id_crud;
        form.elements.titulo.value = task.titulo;
        form.elements.descricao.value = task.descricao;
        document.querySelector('#form-title').textContent = 'Editar tarefa';
        document.querySelector('#submit').textContent = 'Salvar alterações';
        document.querySelector('#cancel').hidden = false;
        form.elements.titulo.focus();
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'danger';
      remove.textContent = 'Excluir';
      remove.addEventListener('click', async () => {
        if (!confirm('Excluir esta tarefa?')) return;
        try {
          await api('/api/tarefa/' + task.id_crud, { method: 'DELETE' });
          resetForm();
          notice('Tarefa excluída.', true);
          await load();
          if (tasks.children.length === 1 && tasks.firstChild.textContent === 'Nenhuma tarefa nesta página.' && currentPage > 1) {
            currentPage--;
            await load();
          }
        } catch (error) { notice(error.message); }
      });
      actions.append(edit, remove);
      row.append(details, actions);
      tasks.append(row);
    }
  } catch (error) { notice(error.message); }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = editing;
  try {
    await api('/api/tarefa' + (id === null ? '' : '/' + id), {
      method: id === null ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: form.elements.titulo.value, descricao: form.elements.descricao.value })
    });
    resetForm();
    currentPage = 1;
    notice(id === null ? 'Tarefa criada.' : 'Tarefa atualizada.', true);
    await load();
  } catch (error) { notice(error.message); }
});
document.querySelector('#cancel').addEventListener('click', resetForm);
document.querySelector('#previous').addEventListener('click', () => { currentPage--; load(); });
document.querySelector('#next').addEventListener('click', () => { currentPage++; load(); });
load();
