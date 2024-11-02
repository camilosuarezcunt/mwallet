// ShareVault.js
import React from 'react';
import { Form, Input, Button, List } from 'antd';
import './ShareVault.css'; // Importa el archivo CSS

const ShareVault = ({
  newVault,
  setNewVault,
  shareAddress,
  setShareAddress,
  selectedVault,
  handleShareVault,
  handleUnshareVault,
  handleDeleteVault,
  handleCancelForm
}) => (
  <Form layout="vertical" className="share-vault-form">
    <Form.Item label="Vault Name">
      <Input
        value={newVault.name}
        onChange={(e) => setNewVault({ ...newVault, name: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Share with Address">
      <Input
        value={shareAddress}
        onChange={(e) => setShareAddress(e.target.value)}
        placeholder="Enter address to share vault"
      />
      <Button type="primary" onClick={handleShareVault} style={{ marginTop: '10px' }}>
        Share
      </Button>
    </Form.Item>
    <List
      header={<div>Shared with:</div>}
      bordered
      dataSource={selectedVault.sharedWith}
      renderItem={(address) => (
        <List.Item
          actions={[
            <Button type="link" danger onClick={() => handleUnshareVault(address)}>
              Unshare
            </Button>,
          ]}
        >
          {address.slice(0, 4)}...{address.slice(38)}
        </List.Item>
      )}
    />
    <Button className="delete-button" type="primary" danger onClick={handleDeleteVault} style={{ margin: '10px' }}>
      Delete Vault
    </Button>
    <Button className="close-button" type="default" onClick={handleCancelForm} style={{ margin: '10px' }}>
      Close
    </Button>
  </Form>
);

export default ShareVault;