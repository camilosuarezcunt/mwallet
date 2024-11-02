// import "../App.css";
import React from 'react';
import { Select, Button, Input } from 'antd';
import { TeamOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const Passwords = ({
  isAddingCredential,
  isAddingVault,
  vaultSettings,
  selectedVault,
  vaults,
  handleSelectVault,
  handleVaultSettings,
  handleAddCredential,
  setSearchPrompt,
  getAllCredentials,
  stringToColor,
  isEmail,
  emailIcon,
  profileIcon,
  renderForms
}) => {
  return (
    <>
      {!isAddingCredential && !isAddingVault && !vaultSettings && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select
              defaultValue={selectedVault?.id ? selectedVault.id : "all"}
              style={{ width: "100%" }}
              onChange={handleSelectVault}
            >
              <Option key="all" value="all">All Vaults</Option>
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
                <Option key="null" value="null" disabled>No vaults available</Option>
              )}
              <Option key="add-vault" value="add-vault">
                + Add New Vault
              </Option>
            </Select>
            {selectedVault !== 'all' && (
              <Button
                icon={<SettingOutlined />}
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={handleVaultSettings}
              />
            )}
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ marginLeft: "10px" }}
              onClick={handleAddCredential}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input.Search
              placeholder="Search passwords"
              onChange={(e) => setSearchPrompt(e.target.value)}
              style={{ marginTop: "10px" }}
            />
          </div>
          <div>
            {vaults && selectedVault ? (
              <>
                {getAllCredentials().length === 0 ? (
                  <p>No credentials found</p>
                ) : (
                  getAllCredentials().map((credential) => (
                    <div key={credential.id} className="credential-container">
                      <div className="user-avatar" style={{ backgroundColor: stringToColor(credential.username) }}>
                        {isEmail(credential.username) ? (
                          <img src={emailIcon} alt="Email Icon" className="email-icon" />
                        ) : (
                          <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
                        )}
                      </div>
                      <div className="credential-details">
                        <p className="credential-text"><strong>Username:</strong> {credential.username}</p>
                        <p className="credential-text"><strong>Password:</strong> {credential.password}</p>
                        <p className="credential-text"><strong>URL:</strong> {credential.url}</p>
                      </div>
                    </div>
                  ))
                )}
              </>
            ) : (
              <span>No vaults found</span>
            )}
          </div>
        </div>
      )}
      {renderForms()}
    </>
  );
};

export default Passwords;
