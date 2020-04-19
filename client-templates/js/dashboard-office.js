// Activate Modals
let openModalsBtns = document.querySelectorAll('.open-modal');
let modalContainer = document.querySelector('#modal-container');

function modalHandler(e) {
  let name = e.target.getAttribute('data-name');
  let id = e.target.getAttribute('data-id');
  let action = e.target.getAttribute('data-action');

  switch (action) {
    case 'delete':
      modalContainer.innerHTML = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Fire ${name}</h5>
              <button type="button" class="close close-modal">
                <span class="close-modal" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to fire ${name}?</p>
              <a href="#" class="btn btn-danger mr-2">Fire</a>
              <button type="button" class="btn btn-secondary close-modal">Close</button>
            </div>
          </div>
        </div>
      `;
      break;

    case 'position':
      let position = e.target.getAttribute('data-position');
      let level = e.target.getAttribute('data-position-level');

      modalContainer.innerHTML = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Change Position of ${name}</h5>
              <button type="button" class="close close-modal">
                <span class="close-modal" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <div class="form-group">
                    <label for="position">Position</label>
                    <input type="text" value="${position}" class="form-control" name="position"  id="position">
                  </div>
                  
                </div>
                <div class="form-group">
                  <label for="level">Position Level</label>
                  <select class="form-control" name="level" id="level">
                    <option value="Leader" ${(level === 'Leader') && 'selected'} >Leader</option>
                    <option value="Manager" ${(level === 'Manager') && 'selected'}>Manager</option>
                    <option value="Worker" ${(level === 'Worker') && 'selected'}>Worker</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary mr-2">Save</button>
                <button type="button" class="btn btn-secondary close-modal">Close</button>
              </form>
            </div>
          </div>
        </div>
      `;
      break;
  }

  modalContainer.classList.add('show');
  modalContainer.classList.add('d-block');

  let closeModalsBtns = document.querySelectorAll('.close-modal');

  for (let i = 0; i < closeModalsBtns.length; i++) {
    closeModalsBtns[i].addEventListener('click', closeModals);
  }
}

function closeModals(e) {
  if (e.target.classList.contains('close-modal')) {
    modalContainer.innerHTML = '';
    modalContainer.classList.remove('show');
    modalContainer.classList.remove('d-block');
  }
}

for (let i = 0; i < openModalsBtns.length; i++) {
  openModalsBtns[i].addEventListener('click', modalHandler);
}