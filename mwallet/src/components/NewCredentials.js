import React from "react";
import { Form, Select, Input, Button } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import "./NewCredentials.css";

const { Option } = Select;

const NewCredentials = ({
  selectedVault,
  vaults,
  handleSelectVault,
  newCredential,
  setNewCredential,
  handleSaveCredential,
  handleCancelForm
}) => {
  return (
    <Form layout="vertical" autoComplete="off">
      <Select
        defaultValue={
          selectedVault === "all"
            ? vaults && vaults.length > 0
              ? vaults.id
              : "null"
            : selectedVault.id
        }
        className="select-narrow input-dark"
        onChange={handleSelectVault}
        placeholder="Select a vault"
      >
        {vaults && vaults.length > 0 ? (
          vaults.map((vault) => (
            <Option key={vault.id} value={vault.id}>
              {vault.name}
              {vault.shared && (
                <Button icon={<TeamOutlined />} type="secondary" style={{ padding: "0" }} />
              )}
            </Option>
          ))
        ) : (
          <Option key="null" value="null" disabled>
            No vaults available
          </Option>
        )}
        <Option key="add-vault" value="add-vault">
          + Add New Vault
        </Option>
      </Select>
      <Form.Item label={<span className="form-item-label">Username</span>}>
        <Input
          value={newCredential.username}
          onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
          className="input-dark"
        />
      </Form.Item>
      <Form.Item label={<span className="form-item-label">Password</span>}>
        <Input.Password
          autoComplete="new-password"
          value={newCredential.password}
          onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
          className="input-dark"
        />
      </Form.Item>
      <Form.Item label={<span className="form-item-label">URL</span>}>
        <Input
          value={newCredential.url}
          onChange={(e) => setNewCredential({ ...newCredential, url: e.target.value })}
          className="input-dark"
        />
      </Form.Item>
      <Button type="primary" onClick={handleSaveCredential} style={{ marginRight: "10px" }}>
        Save
      </Button>
      <Button onClick={handleCancelForm} style={{ marginBottom: "20px" }} className="cancel-button">
        Cancel
      </Button>
    </Form>
  );
};

export default NewCredentials;