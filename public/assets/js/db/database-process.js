const addNewDb = () => {
  const data = {
    dbName: document.getElementById('dbName').value,
    dbType: document.getElementById('dbType').value,
    dbConnectionString_user: document.getElementById('dbConnectionString_user').value,
    dbConnectionString_password: document.getElementById('dbConnectionString_password').value,
    dbConnectionString_server: document.getElementById('dbConnectionString_server').value,
    dbConnectionString_database: document.getElementById('dbConnectionString_database').value,

  }
  const res = send('/database/api/add', enums.types.POST, data)
    .then((data) => {
      console.log(data);
      addNewDbInHtml(data);
    });
}
const deleteDb = (id) => {
  if (!confirm('Silmek istediğinize emin misiniz ?')) return;

  const data = {
    dbId: id
  }
  const res = send(`/database/api/delete/${id}`, enums.types.POST)
    .then((data) => {
      document.querySelector(`[data-id="${id}"]`).remove();
    });
}
const addNewDbInHtml = (data) => {
  const row = document.getElementById('data-row');
  const template = `
        <div class="col-lg-3 col-md-4" data-id="${data._id}">
        <div class="card card-pricing">
          <div class="card-header">
            <div class="row">
              <h6 class="col-md-9 ml-auto mt-auto mb-auto text-left">${data.dbName}</h6>
              <div class="mb-auto mt-auto ml-auto mr-auto btn btn-danger btn-round btn-icon"
                onclick="deleteDb('${data._id}')">
                <i class="nc-icon nc-simple-remove"></i>
              </div>
            </div>

          </div>
          <div class="card-body">
            <div class="card-icon icon-primary ">
              <i class="nc-icon nc-spaceship"></i>
            </div>
            <h4 class="card-title">${data.dbType}</h4>
            <h6 class="card-title">${data.dbConnectionString}</h6>
          </div>
          <div class="card-footer">
            <a href="/database/${data._id}" class="btn btn-round btn-primary">Edit</a>
          </div>
        </div>
      </div>`;

  row.insertAdjacentHTML('beforeend', template);

}
const createDbFirstInit = () => {
  const id = document.getElementById('base-db').getAttribute('data-id');
  const res = send(`/database/api/init/${id}`, enums.types.POST)
    .then((data) => {
      console.log(data);
    })
    .catch(err => console.log(err));
}