const createGroupModalInit = async () => {
    const res = await send('/database/api/dbs', enums.types.GET, {})
        .then((data) => {
            console.log(data);
            data.map(x => inHtml(x));
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
                <input class="bootstrap-switch" type="checkbox" data-toggle="switch" checked data-on-color="default" data-off-color="default" data-on-label="Main" data-off-label="Sycn" data-main-id="${data._id}">
            </div>
        </div>
    </div>`;

    row.insertAdjacentHTML('beforeend', template);
}
window.addEventListener('DOMContentLoaded', async (event) => {
    await createGroupModalInit();
});
