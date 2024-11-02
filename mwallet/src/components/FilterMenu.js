// FilterMenu.js
import React from 'react';
import { Checkbox, Select, Button } from 'antd';
import '../App.css'; // Asegúrate de importar el archivo CSS

const FilterMenu = () => (
  <div className="filter-wg">
    <div className="dropdown-head">
      <span className="dropdown-title">Filter Users</span>
      <div>
        <a href="#" className="btn btn-sm btn-icon">
          <em className="icon ni ni-more-h"></em>
        </a>
      </div>
    </div>
    <div className="dropdown-body">
      <div className="row gx-6 gy-3">
        <div className="col-6">
          <Checkbox id="hasBalance" style={{ color: 'white' }}>Have Balance</Checkbox>
        </div>
        <div className="col-6">
          <Checkbox id="hasKYC" style={{ color: 'white' }}>KYC Verified</Checkbox>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label className="overline-title overline-title-alt label-white">Role</label>
            <Select
              className="form-select form-select-sm"
              defaultValue="any"
              dropdownStyle={{ backgroundColor: '#101924', color: 'white', border: '1px solid #364A63' }} // Estilo personalizado para el menú desplegable
            >
              <Select.Option value="any">Any Role</Select.Option>
              <Select.Option value="investor">Investor</Select.Option>
              <Select.Option value="seller">Seller</Select.Option>
              <Select.Option value="buyer">Buyer</Select.Option>
            </Select>
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label className="overline-title overline-title-alt label-white">Status</label>
            <Select
              className="form-select form-select-sm"
              defaultValue="any"
              dropdownStyle={{ backgroundColor: '#101924', color: 'white', border: '1px solid #364A63' }} // Estilo personalizado para el menú desplegable
            >
              <Select.Option value="any">Any Status</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="suspend">Suspend</Select.Option>
              <Select.Option value="deleted">Deleted</Select.Option>
            </Select>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <Button type="button" className="btn btn-secondary">Filter</Button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown-foot">
      <a className="clickable" href="#" style={{ color: '#0E4EA4' }}>Reset Filter</a>
      <a className="clickable" href="#" style={{ color: '#0E4EA4' }}>Save Filter</a>
    </div>
  </div>
);

export default FilterMenu;