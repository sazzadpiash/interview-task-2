import { ProjectsSvg } from 'Components/Icons/Projects';
import React, { useState, useEffect } from 'react';
// import { Api } from 'Utils/api';
// import Modal from 'react-modal';
import './cfp.css';
import { useUser } from 'Context/User';
import { UserModel } from 'Containers/User/Models/UserModel';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyProjectsDataModal } from 'Containers/Projects/Modals';
import { myFormsSelector, myProjectsSelector } from 'Containers/Projects/selectors';
import { areEqual } from 'Utils/equalityChecks';
import { CompanyFormsModal } from 'Containers/Projects/Modals/CompanyProjectsModal/CompanyProjectsModal';
import { listCompanyForms } from 'Containers/Projects/actions';
import { TrashSvg } from 'Components/Icons/Trash';
import { ExteriorSvg } from 'Components/Icons/Exterior';
import { createCompanyForm, removeCompanyForm } from 'Containers/Company/actions';
// import { handleApiRequest } from 'Utils/handleApiRequest';
// import { getFormList } from 'Containers/Company/actions';

const CustomFormPage = () => {
  const dispatch = useDispatch();
  const myProjects: CompanyProjectsDataModal = useSelector(myProjectsSelector, areEqual);
  const myForms: CompanyFormsModal = useSelector(myFormsSelector, areEqual);

  const user: UserModel = useUser();
  const [companyId, setCompanyId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  console.log(myForms);
  console.log(myProjects);

  dispatch(listCompanyForms(companyId));

  useEffect(() => {
    if (user?.id) {
      const { companies } = user;
      if (companies.length > 0) {
        const [company] = companies;
        const { id } = company;
        setCompanyId(id);
      }
    }
  }, [user]);

  // const getFormList =
  //   (companyId: number) =>
  //   async (dispatch: any, _getState = null, utils: any) => {
  //     const response = await handleApiRequest(dispatch, utils.Api.get(`/companies/${companyId}/contract-forms`));

  //     if (response?.data) {
  //       console.log(response?.data);

  //       // const { data } = response;
  //       // dispatch({
  //       //   type: COMPANY_PHONES,
  //       //   payload: data,
  //       // });
  //     }
  //   };
  // getFormList(companyId);

  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch(`/companies/${id}/contract-forms`);
  //     const data = await response.json();
  //     setData(data);
  //   }

  //   fetchData();
  // }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteModal(false);
  };

  const handleDelete = () => {
    dispatch(removeCompanyForm(companyId, deleteId));
    handleCloseModal();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const nameValue = event.target.name.value;
    const data = {
      company_id: companyId,
      name: nameValue,
      replacement_tags: '',
      status: 'active',
      template: 'typeof string',
      has_signature: true,
    };
    dispatch(createCompanyForm(companyId, data));
    handleCloseModal();
  };

  return (
    <div className="p-10 bg-white main-box">
      <div>
        <span className="custom-tab">
          <ProjectsSvg fill="#ffffff" />
          Contact Forms
        </span>
      </div>
      <div className="form-title-bar">
        <span className="form-title">Form Templates</span>
        <button onClick={handleOpenModal} className="add-btn">
          <span>Add</span>
          <span className="btn-plus">+</span>
        </button>
      </div>
      <div className={`${showModal ? 'modal-open create-form-modal' : 'modal-close'}`}>
        <div className={`${showModal ? 'modal-open modal-header' : 'modal-close'}`}>
          <h4>Add Contact Form</h4>
          <button className="cross-btn" onClick={handleCloseModal}>
            X
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmitForm}>
            <label htmlFor="companyForm">Form Name</label>
            <input id="companyForm" name="name" type="text" placeholder="Authorization Form" />
            <label>
              <input type="checkbox" name="example-checkbox" value="example-value" />
              Require Signeture
            </label>
            <p>Contract Template</p>
            <div className="contract-template-form">
              <div className="ul-box">
                <ul className="form-ul">
                  <li>~~~name~~~</li>
                  <li>~~~project~~~</li>
                  <li>~~~job_no~~~</li>
                  <li>~~~company~~~</li>
                  <li>~~~current_date~~~</li>
                  <li>~~~date_of_loss~~~</li>
                  <li>~~~company_address~~~</li>
                  <li>~~~policy_holder_name~~~</li>
                  <li>~~~policy_number~~~</li>
                  <li>~~~claim_number~~~</li>
                  <li>~~~input~~~</li>
                  <li>~~~checkbox~~~</li>
                </ul>
              </div>
              <textarea name="textarea" className="textarea" cols={30} rows={10} />
            </div>
            <div className="btn-box">
              <button type="submit" className="btn btn-primary">
                Add Contract
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="table-box">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">TEMPLATE NAME</th>
              <th scope="col">DATE CREATED</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {myForms?.data.map((form) => (
              <tr key={form.id}>
                <th scope="row"></th>
                <td>{form?.name}</td>
                <td>{form?.created_at}</td>
                <td>
                  <TrashSvg onClick={() => handleDeleteModal(form?.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`delete-modal ${deleteModal ? 'modal-open' : 'modal-close'}`}>
        <div>Delete Contact Form</div>
        <p>Are You Sure You want to delete this From?</p>
        <div className="d-grid gap-2 d-md-block">
          <button onClick={handleDelete} className="btn btn-outline-danger">
            Delete
          </button>
          <button onClick={handleCloseModal} className="btn btn-outline-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomFormPage;
