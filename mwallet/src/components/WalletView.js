import "../App.css";
import React, { useEffect, useState } from "react";
import { Divider, Tooltip, List, Avatar, Spin, Tabs, Input, Button, Select, Form, message, Dropdown, Menu, Checkbox } from "antd";
import { LogoutOutlined, PlusOutlined, SettingOutlined, TeamOutlined, DownOutlined, SortAscendingOutlined, RightOutlined, EyeOutlined, EyeInvisibleOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import DePass_abi from '../contracts/DePass_abi.json';
import { v4 as uuidv4 } from 'uuid';
import NFTs from './NFTs';
import Tokens from './Tokens';
import Transfer from './Transfer';
import emailIcon from "../images/icons/emails.svg";
import profileIcon from "../images/icons/id-front.svg";
import FilterMenu from './FilterMenu';
import ShareVault from './ShareVault';
import NewCredentials from "./NewCredentials"; // Asegúrate de ajustar la ruta de importación según tu estructura de proyecto


function WalletView({
  wallet,
  credentials = [],
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}) {
  const [copiedPasswordId, setCopiedPasswordId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [expandedCredential, setExpandedCredential] = useState(null);
  const navigate = useNavigate();
  const [vaults, setVaults] = useState([]);
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedVault, setSelectedVault] = useState("all");
  const [contract, setContract] = useState(null);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [isAddingVault, setIsAddingVault] = useState(false);
  const [vaultSettings, setVaultSettings] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [visibleCredentials, setVisibleCredentials] = useState(credentials);
  const [showCount, setShowCount] = useState(10);
  const [sortedCredentials, setSortedCredentials] = useState(credentials);
  const [sortOrder, setSortOrder] = useState('ASC'); // Estado para el orden de clasificación
  const [newCredential, setNewCredential] = useState({
    username: "",
    password: "",
    url: "",
  });
  const { Option } = Select;
  const contractAddressSepolia = '0x104B17bA85F06080B039bD3BEFc1BaC0d3cC19dD';

  const handleMenuClick = (e) => {
    const { key } = e;
    if (key === 'ASC' || key === 'DESC') {
      setSortOrder(key);
      sortCredentials(key);
    } else {
      setShowCount(parseInt(key, 10));
    }
  };

  const sortCredentials = (order) => {
    const sorted = [...credentials].sort((a, b) => {
      if (order === 'ASC') {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
    setSortedCredentials(sorted);
  };

  const menu = (
    <Menu onClick={handleMenuClick} className="sortmenu">
      <Menu.ItemGroup title="Show">
        <Menu.Item key="10">10</Menu.Item>
        <Menu.Item key="20">20</Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Order">
        <Menu.Item key="DESC">DESC</Menu.Item>
        <Menu.Item key="ASC">ASC</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const filteredCredentials = sortedCredentials.slice(0, showCount);

  const togglePasswordVisibility = (credentialId) => {
    setVisiblePasswords(prevState => ({
      ...prevState,
      [credentialId]: !prevState[credentialId]
    }));
  };

  const toggleExpand = (credentialId) => {
    setExpandedCredential(expandedCredential === credentialId ? null : credentialId);
  };

  const copyToClipboard = (text, credentialId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPasswordId(credentialId);
      message.success('Copied!');
      setTimeout(() => {
        setCopiedPasswordId(null);
      }, 2000);
    });
  };

  const handleSelectVault = (value) => {
    if (value === "add-vault") {
      setSelectedVault(null);
      handleAddVault();
    } else if (value === "all") {
      setSelectedVault("all");
    } else {
      const selectedVault = vaults.find((vault) => vault.id === value);
      setSelectedVault(selectedVault);
    }
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const isEmail = (username) => {
    return username.includes("@");
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const handleSortCredentials = () => {

  };


  const [newVault, setNewVault] = useState({
    name: "",
  });

  const [shareAddress, setShareAddress] = useState('');

  // Use ABI to create an interface
  const DePassInterface = new ethers.Interface(DePass_abi);

  // Mock encryption/decryption functions
  const encrypt = (data) => JSON.stringify(data);;
  const decrypt = (data) => data;

  const handleAddCredential = () => {
    setIsAddingCredential(true);
  };

  const handleAddVault = () => {
    setIsAddingCredential(false);
    setIsAddingVault(true);
  };

  const handleVaultSettings = () => {
    setVaultSettings(true);
  };

  const handleSaveCredential = async () => {
    setFetching(true);
    const credentialId = ethers.keccak256(ethers.toUtf8Bytes(uuidv4()));
    const encryptedData = encrypt(newCredential);
    const tx = await contract.addCredential(selectedVault.id, credentialId, encryptedData);
    await tx.wait();
    setIsAddingCredential(false);
    setNewCredential({ username: "", password: "", url: "" });
    //setSelectedVault("all");
    await fetchVaults();
    setFetching(false);
  };

  const handleSaveVault = async () => {
    setFetching(true);
    const vaultId = ethers.keccak256(ethers.toUtf8Bytes(uuidv4()));
    const symmetricKey = "symmetrickey"; // Clave simétrica ficticia
    const tx = await contract.createVault(vaultId, newVault.name, symmetricKey);
    await tx.wait();
    setIsAddingVault(false);
    setNewVault({ name: "" });
    setSelectedVault("all");
    await fetchVaults();
    setFetching(false);
  };

  const handleCancelForm = () => {
    setIsAddingVault(false);
    setIsAddingCredential(false);
    setVaultSettings(false);
    setNewVault({ name: "" });
    setNewCredential({ username: "", password: "", url: "" });
    setSelectedVault("all");
  };

  const handleShareVault = async () => {
    setFetching(true);
    if (!shareAddress) {
      return;
    }
    try {
      const tx = await contract.shareVault(selectedVault.id, shareAddress, "symmetrickey");
      await tx.wait();
      setShareAddress('');
      fetchVaults();
    } catch (error) {
      // Manejo de errores
    }
    setFetching(false);
  };

  const handleUnshareVault = async (address) => {
    setFetching(true);
    try {
      const tx = await contract.unshareVault(selectedVault.id, address);
      await tx.wait();
      fetchVaults();
    } catch (error) {
      // Manejo de errores
    }
    setFetching(false);
  };

  const handleDeleteVault = async () => {
    setFetching(true);
    try {
      const tx = await contract.deleteVault(selectedVault.id);
      await tx.wait();
      handleCancelForm();
      fetchVaults();
    } catch (error) {
      // Manejo de errores
    }
    setFetching(false);
  };

  const orderVaults = (vaults) => {
    return vaults.sort((a, b) => {
      if (a.sharedWithMe !== b.sharedWithMe) {
        return a.sharedWithMe - b.sharedWithMe ? 1 : -1;
      }
      return (a.name).localeCompare(b.name);
    });
  };

  const filterVaults = (vaults, selectedVault) => {
    return vaults.filter(vault =>
      selectedVault === "all" ? true : vault.id === selectedVault.id
    );
  };

  const extractCredentials = (vaults, selectedVault) =>
    selectedVault === "all"
      ? vaults.flatMap(vault => vault.credentials)
      : vaults.reduce((acc, vault) => acc.concat(vault.credentials), []);

  const filterCredentials = (credentials, searchPrompt) => {
    return credentials.filter(cred =>
      cred.url.includes(searchPrompt)
    );
  };

  const sortCredentialsByUrl = (credentials) =>
    credentials.sort((a, b) => (a.url || '').localeCompare(b.url || ''));

  const getAllCredentials = () => {
    const filteredVaults = filterVaults(vaults, selectedVault);
    const allCredentials = extractCredentials(filteredVaults, selectedVault);
    const filteredCredentials = filterCredentials(allCredentials, searchPrompt);
    return sortCredentialsByUrl(filteredCredentials);
  };



  const renderForms = () => {
    if (isAddingCredential) {
      return (
        <div>
          <NewCredentials
            selectedVault={selectedVault}
            vaults={vaults}
            handleSelectVault={handleSelectVault}
            newCredential={newCredential}
            setNewCredential={setNewCredential}
            handleSaveCredential={handleSaveCredential}
            handleCancelForm={handleCancelForm}
          />
        </div>
      );
        } else if (vaultSettings) {
          return (
            <div>
                    <ShareVault
                      newVault={newVault}
                      setNewVault={setNewVault}
                      shareAddress={shareAddress}
                      setShareAddress={setShareAddress}
                      selectedVault={selectedVault}
                      handleShareVault={handleShareVault}
                      handleUnshareVault={handleUnshareVault}
                      handleDeleteVault={handleDeleteVault}
                      handleCancelForm={handleCancelForm}
                    />
            </div>
      );
    }
  };

  const items = [
    {
      key: "4",
      label: <span>Passwords</span>,
      children: (
        <>
          {!isAddingCredential && !isAddingVault && !vaultSettings && (
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
              <Select
                style={{ width: "40%" }}
                defaultValue={selectedVault?.id ? selectedVault.id : "all"}
                onChange={handleSelectVault}
              >
                <Option key="all" value="all">All Vaults</Option>
                {vaults && vaults.length > 0 ? (
                  vaults.map((vault) => (
                    <Option key={vault.id} value={vault.id}>
                      {vault.name}
                      {vault.shared && (
                        <Button icon={<TeamOutlined />} type="secondary" className="custom-option-button" />
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
                {selectedVault != 'all' && (<Button
                  className="setting-button"
                  icon={<SettingOutlined />}
                  type="secondary"
                  // style={{ marginLeft: "1px", marginRight: "1px" }}
                  onClick={handleVaultSettings}
                />)}
                  <Input.Search
                    style={{ width: "40%" }}
                    placeholder="Search passwords"
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    className="input-dark"
                  />
                <Button
                  className="add-button"
                  icon={<PlusOutlined />}
                  type="secondary"
                  style={{ marginLeft: "10px" }}
                  onClick={handleAddCredential}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                      icon={<SortAscendingOutlined />} // Icono de ordenar
                      type="secondary"
                      className="sorting-button"
                    />
                  </Dropdown>
                  <Dropdown overlay={<FilterMenu />} trigger={['click']} placement="bottomRight">
                    <Button
                      icon={<FilterOutlined />}
                      type="secondary"
                      className="filter-button"
                    />
                  </Dropdown>
                </div>
              </div>

              <div>
                {vaults && selectedVault ? (
                  <>
                    {getAllCredentials().length === 0 ? (
                      <p>No credentials found</p>
                    ) : (
                      getAllCredentials().map((credential) => (
                        <div key={credential.id} className="credential-container">
                          <div className="credential-container">
                            <div className="user-avatar" style={{ backgroundColor: stringToColor(credential.username) }}>
                              {isEmail(credential.username) ? (
                                <img src={emailIcon} alt="Email Icon" className="email-icon" />
                              ) : (
                                <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
                              )}
                            </div>
                            <div className="credential-details">
                              <div className="credential-header" onClick={() => toggleExpand(credential.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p className="credential-text credential-username" style={{ margin: 0 }}>
                                  <strong>Username:</strong> {credential.username}
                                </p>
                                <span className={`credential-icon ${expandedCredential === credential.id ? 'active' : ''}`} style={{ marginLeft: '10px' }}>
                                  <RightOutlined />
                                </span>
                              </div>
                              <div className={`credential-content ${expandedCredential === credential.id ? 'expanded' : ''}`}>
                                <div className="password-container">
                                  <p className="credential-text" onClick={() => copyToClipboard(credential.password, credential.id)} style={{ cursor: 'pointer' }}>
                                    <strong>Password:</strong>
                                    {visiblePasswords[credential.id] ? credential.password : '*'.repeat(credential.password.length)}
                                  </p>
                                  {copiedPasswordId === credential.id && <span className="copied-message">Copied!</span>}
                                  <button
                                    className="eye-button"
                                    onClick={() => togglePasswordVisibility(credential.id)}
                                  >
                                    {visiblePasswords[credential.id] ? (
                                      <EyeInvisibleOutlined className="eye-icon active" />
                                    ) : (
                                      <EyeOutlined className="eye-icon" />
                                    )}
                                  </button>
                                </div>
                                <p className="credential-text"><strong>URL:</strong> {credential.url}</p>
                              </div>
                            </div>
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
      ),
    },


    {
      key: "3",
      label: <span>Tokens</span>,
      children:
      <Tokens
        tokens={tokens}
        logo={logo}
      />,
    },
    {
      key: "2",
      label: <span>NFTs</span>,
      children: <NFTs nfts={nfts} />,
    },
    {
      key: "1",
      label: <span>Transfer</span>,
      children: (
        <Transfer
          balance={balance}
          CHAINS_CONFIG={CHAINS_CONFIG}
          selectedChain={selectedChain}
          seedPhrase={seedPhrase}
          processing={processing}
          setProcessing={setProcessing}
          getAccountTokens={getAccountTokens}
        />
      ),
    },
  ];

  async function getAccountTokens() {
    setFetching(true);
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const balance = await provider.getBalance(wallet);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    setBalance(balanceInEth);
    setFetching(false);
  }

  async function setContractsConfiguration() {
    setFetching(true);
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const signer = new ethers.Wallet(privateKey, provider);
    let tempContract = new ethers.Contract(contractAddressSepolia, DePass_abi, signer);
    setContract(tempContract);
    setFetching(false);
  }

  const processCredentials = async (vault) => {
    const processedCredentials = await Promise.all(
      vault.credentials.map(async (cred) => {
        try {
          const decryptedData = decrypt(cred.encryptedData);
          const credential = JSON.parse(decryptedData);
          return { id: cred.id, ...credential };
        } catch (error) {
          return null;
        }
      })
    );
    return processedCredentials.filter((cred) => cred != null && cred.id != null);
  };

  const fetchVaults = async () => {
    setFetching(true);
    if (contract) {
      try {
        const retrievedVaults = await contract.getVaults();
        const processedVaults = retrievedVaults.length == 0 ? [] : await Promise.all(retrievedVaults.map(async (vault) => {
          const processedCredentials = await processCredentials(vault);
          return {
            id: vault.id,
            name: vault.name,
            sharedWith: Array.from(vault.sharedWith),
            credentials: processedCredentials,
            shared: vault.sharedWith.length > 0 ? true : false,
            sharedWithMe: false
          };
        }));
        const retrievedSharedVaults = await contract.getSharedVaults();
        const processedSharedVaults = retrievedSharedVaults.length == 0 ? [] : await Promise.all(retrievedSharedVaults
          .map(async (vault) => {
            const processedCredentials = await processCredentials(vault);
            return {
              id: vault.id,
              name: vault.name,
              sharedWith: Array.from(vault.sharedWith),
              credentials: processedCredentials,
              shared: true,
              sharedWithMe: true
            };
          }));
        const orderedVaults = orderVaults(processedVaults.concat(processedSharedVaults));
        setVaults(orderedVaults);
        if (selectedVault && selectedVault.id) {
          const matchedVault = orderedVaults.filter(vault => vault.id === selectedVault.id);
          if (matchedVault.length > 0) {
            setSelectedVault(matchedVault[0]);
          }
        }
      } catch (error) {
        // Manejo de errores
      }
    }
    setFetching(false);
  };

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    localStorage.setItem('wallet', null);
    localStorage.setItem('seedPhrase', null);
    setVaults(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (!wallet) return;
    setVaults(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
    setContractsConfiguration();
  }, [wallet, selectedChain]);

  useEffect(() => {
    if (!contract) return;
    fetchVaults()
  }, [contract]);

  return (
    <>
      <div className="content">
        <div className="logoutButton" onClick={logout}>
          <LogoutOutlined />
        </div>
        <div className="walletName">Wallet</div>
        <Tooltip title={wallet}>
          <div className="walletAddress">
            {wallet.slice(0, 4)}...{wallet.slice(38)}
          </div>
        </Tooltip>
        <Divider />
        {fetching ? (
          <Spin />
        ) : (
          <Tabs defaultActiveKey="4" items={items} className="walletView" />
        )}
      </div>
    </>
  );
  }

export default WalletView;
