const createGroupModalInit = async () => {
    const res = await send('/database/api/dbs', enums.types.GET, {})
        .then((datas) => {
            datas.map(x => inHtml(x));
            initToogleButtonSwitch();
        });
}

const createGroup = async () => {
    if (!confirm('Are you sure you want to create new group?')) {
        return;
    }
    const dbs = document.getElementById('include-body');
    const rows = [...dbs.querySelectorAll('[data-id]')];
    let dbIds = [];
    rows.forEach(element => {
        dbIds.push(element.getAttribute('data-id'));
    });
    const data = {
        dbIds: dbIds

    }
    const res = send(`/group/api/add`, enums.types.POST, data)
        .then((data) => {
            console.log(data);
            // const inputs = base_db.querySelectorAll('input');
            // for (let i = 0; i < inputs.length; i++) {
            //     const element = inputs[i];
            //     element.setAttribute('readonly', 'true');
            // }
            // base_db.setAttribute(enums.element_data_attribute.readonly_open, true);
        }).error((err) => {
            console.error(err);
        });
}

const inHtml = (data) => {
    const row = document.getElementById('include-body');
    const template = `
    <div class="instruction">
        <div class="row" data-id="${data._id}">
            <div class="col-md-10">
                <strong>${data.dbName}</strong>
                <p class="description">${data.dbType}</p>
            </div>
            <div class="col-md-2">
                <input 
                class="bootstrap-switch" 
                type="checkbox" 
                data-toggle="switch" 
                data-on-color="default" 
                data-off-color="default" 
                data-on-label="Sycn" 
                data-off-label="Sycn" 
                data-main-id="${data._id}">
            </div>
        </div>
    </div>`;

    row.insertAdjacentHTML('beforeend', template);
}

window.addEventListener('DOMContentLoaded', async (event) => {
    await createGroupModalInit();
});
