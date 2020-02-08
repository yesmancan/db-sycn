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
                      <div class="mb-auto mt-auto ml-auto mr-auto btn btn-danger btn-round btn-icon" onclick="deleteDb('${data._id}')">
                        <i class="nc-icon nc-simple-remove"></i>
                      </div>
                    </div>

                  </div>
                  <div class="card-body">
                    <div class="card-icon icon-primary ">
                      <i class="nc-icon nc-spaceship"></i>
                    </div>

                    <div class="row">
                      <div class="col-md-10 mr-auto ml-auto">
                        <div class="form-group">
                          <h3 class="card-title mt-auto" style="margin-top: 0!important;margin-bottom: 0!important;">
                            <input type="text" class="form-control" value="${data.DatabaseConfig.database}" placeholder="user" readonly="">
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-10 mr-auto ml-auto">
                        <div class="form-group">
                          <h3 class="card-title mt-auto" style="margin-top: 0!important;margin-bottom: 0!important;">
                            <input type="text" class="form-control" placeholder="server" value="${data.DatabaseConfig.server}" readonly="">
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-10 mr-auto ml-auto">
                        <div class="form-group">
                          <h3 class="card-title mt-auto" style="margin-top: 0!important;margin-bottom: 0!important;">
                            <input type="text" class="form-control" value="${data.DatabaseConfig.database}" placeholder="database" readonly="">
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="btn-group bootstrap-select"><button type="button" class="dropdown-toggle btn btn-warning btn-round" data-toggle="dropdown" role="button" data-id="dbType" title="MSSQL"><span class="filter-option pull-left">MSSQL</span>&nbsp;<span class="bs-caret"></span></button><div class="dropdown-menu open" role="combobox"><ul class="dropdown-menu inner" role="listbox" aria-expanded="false"><li data-original-index="1" class="disabled"><a tabindex="-1" class="" data-tokens="null" role="option" href="#" aria-disabled="true" aria-selected="false"><span class="text">DB TYPE</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li><li data-original-index="2" class="selected"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="true"><span class="text">MSSQL</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li></ul></div><select class="selectpicker" data-size="2" id="dbType" data-style="btn btn-warning btn-round" title="Single Select" tabindex="-98"><option class="bs-title-option" value="">Single Select</option>
                          <option disabled="">DB TYPE</option>
                          <option value="MSSQL" selected="">MSSQL</option>
                        </select></div>
                      </div>
                    </div>

                  </div>
                  <div class="card-footer">
                    <a href="/database/${data.DatabaseConfig._id}" class="btn btn-round btn-primary">Edit</a>
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
const updateDb = () => {
  const base_db = document.getElementById('base-db');
  const id = base_db.getAttribute(enums.element_data_attribute.data_id);
  const data_readonly_open = toBoolean(base_db.getAttribute(enums.element_data_attribute.readonly_open));
  if (data_readonly_open) {
    const inputs = base_db.querySelectorAll('input[readonly]');
    for (let i = 0; i < inputs.length; i++) {
      const element = inputs[i];
      element.removeAttribute('readonly');
    }
    base_db.setAttribute(enums.element_data_attribute.readonly_open, false);
    return;
  }

  if (!confirm('Are you sure you want to update?')) {
    return;
  }

  const data = {
    dbName: document.getElementById('dbName').value,
    dbType: document.getElementById('dbType').value,
    dbConnectionString_user: document.getElementById('dbConnectionString_user').value,
    dbConnectionString_password: document.getElementById('dbConnectionString_password').value,
    dbConnectionString_server: document.getElementById('dbConnectionString_server').value,
    dbConnectionString_database: document.getElementById('dbConnectionString_database').value,

  }
  const res = send(`/database/api/update/${id}`, enums.types.POST, data)
    .then((data) => {
      const inputs = base_db.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        element.setAttribute('readonly', 'true');
      }
      base_db.setAttribute(enums.element_data_attribute.readonly_open, true);
    });
}

const collepse = (item) => {
  const root = item.parentElement;
  if (root) {
    const rootstep = root.getAttribute('data-collepse')
    if (toBoolean(rootstep)) {
      let neighbor = root.nextElementSibling;
      while (neighbor) {
        neighbor.classList.remove('hide');
        neighbor = neighbor.nextElementSibling;
      }
      root.setAttribute('data-collepse', false);
      item.classList.remove('yes-expand-icon');
      item.classList.add('yes-collepse-icon');
    } else {
      let neighbor = root.nextElementSibling;
      while (neighbor) {
        neighbor.classList.add('hide');
        neighbor = neighbor.nextElementSibling;
      }
      root.setAttribute('data-collepse', true);
      item.classList.add('yes-expand-icon');
      item.classList.remove('yes-collepse-icon');
    }
  }
}