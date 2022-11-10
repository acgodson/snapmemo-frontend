import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router.js";
import cookies from "js-cookie";
import { initFirebase, WEB3AUTH_CLIENT_ID } from "../config";
import { getAuth, UserCredential, TwitterAuthProvider } from "firebase/auth";
import { Web3AuthCore } from "@web3auth/core";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
export interface AuthContext {
  values: {};
}
import RPC from "../utils/algorandRPC";

export const GlobalContext = createContext<AuthContext["values"] | null>(null);

initFirebase();
const GlobalProvider = ({ children }) => {
  const auth = getAuth();
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState<any | null>(null);
  const [keyPairs, setKeyPairs] = useState<any | null>(null);
  const [balance, setBalance] = useState<any | null>(null);
  const router = useRouter();
  const [userObject, setUserObject] = useState({
    country: "",
    email: "",
    imgUrl: "",
    name: "",
    phone: "",
    uid: "",
  });
  const [web3Profile, setWeb3Profile] = useState<any | null>(null);
  const [twitterAuthCredential, setTwitterAuthCredential] = useState<
    any | null
  >(null);
  const [twitterProvider, setTwitterProvider] = useState<any | null>(null);

  const getUserFromCookie = () => {
    const cookie = cookies.get("auth");
    if (!cookie) {
      return;
    }
    return cookie;
  };

  const setUserCookie = (user: { id: any; email: any; token: any }) => {
    cookies.set("auth", user, {
      expires: 1 / 24,
    });
  };
  1;

  const removeUserCookie = () => cookies.remove("auth");

  const mapUserData = async (user: {
    getIdToken?: any;
    uid?: any;
    email?: any;
  }) => {
    const { uid, email } = user;
    const token = await user.getIdToken(true);
    return {
      id: uid,
      email,
      token,
    };
  };

  const loginWeb3 = async (credential: UserCredential) => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await credential.user.getIdToken(true);
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: idToken,
          verifierIdField: "sub",
          domain: "http://localhost:3000",
        },
      }
    );
    setProvider(web3authProvider);
  };

  const getWeb3Profile = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    if (user) {
      setWeb3Profile(user);
    }
  };

  const web3Logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const logout = async () => {
    web3Logout();
    return auth
      .signOut()
      .then(() => {
        router.push("/signin");
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  const onGetAlgorandKeypair = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as SafeEventEmitterProvider);
    const algorandKeypair = await rpc.getAlgorandKeyPair();
    console.log("Keypair", algorandKeypair);
    if (algorandKeypair) {
      setKeyPairs(algorandKeypair);
    }
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    if (userAccount) {
      setAccount(userAccount);
    }
  };

  const fetchBalance = async () => {
    try {
      const rpc = new RPC(provider);
      const aClient = await rpc.makeClient();
      if (aClient) {
        console.log("Algo client successfully connected");
        const values = await aClient.accountInformation(keyPairs.addr).do();
        if (values) {
          const { amount } = values;
          const formattedAmount = Math.floor(amount / 1e6);
          setBalance(formattedAmount);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createAsset = async (cid: string) => {
    const rpc = new RPC(provider);
    const result = await rpc.createAsset(cid);
    return result;
  };

  const findAccountsAsset = async (address: string) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.findAssetsOnAccount(address);

    return result;
  };

  useEffect(() => {
    const twit = JSON.parse(localStorage.getItem("twit"));
    if (twit) {
      setTwitterAuthCredential(twit);
    }
  }, []);

  useEffect(() => {
    const prov = JSON.parse(localStorage.getItem("twitterProvider"));
    if (prov) {
      setTwitterProvider(prov);
    }
  }, []);

  //Initialize web3Auth
  useEffect(() => {
    const clientId = WEB3AUTH_CLIENT_ID;
    const init = async () => {
      try {
        const web3auth = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
          },
        });

        const openLoginAdapter = new OpenloginAdapter({
          adapterSettings: {
            network: "testnet",
            clientId: clientId,
            uxMode: "redirect", // other option: popup
            loginConfig: {
              jwt: {
                name: "Snapmemo Login",
                verifier: "snappymemo",
                typeOfLogin: "jwt",
                clientId: "snapmemo-e421c",
              },
            },
          },
        });

        web3auth.configureAdapter(openLoginAdapter);

        setWeb3auth(web3auth);

        await web3auth.init();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  //Unscribe from Authlistner
  useEffect(() => {
    const cancelAuthListener = auth.onIdTokenChanged(async (userToken: any) => {
      if (userToken) {
        const userData = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie = getUserFromCookie();

    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);

    cancelAuthListener();
  }, []);

  //Listen to UnAuthStateChange
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push("/signin");
      }
    });
  }, []);

  useEffect(() => {
    if (provider) {
      if (!web3Profile) {
        getWeb3Profile();
      }
    }
  });

  ///Fetch Account
  useEffect(() => {
    if (!account) {
      getAccounts();
    }
  });

  // Fetch KeyPairs
  useEffect(() => {
    if (!keyPairs) {
      onGetAlgorandKeypair();
    }
  });

  //Fetch ccount Balance
  useEffect(() => {
    if (!balance) {
      if (keyPairs) {
        fetchBalance();
      }
    }
  });

  return (
    <GlobalContext.Provider
      value={{
        userObject,
        setUserObject,
        mapUserData,
        user,
        logout,
        setUserCookie,
        getUserFromCookie,
        loginWeb3,
        setTwitterAuthCredential,
        twitterAuthCredential,
        keyPairs,
        account,
        fetchBalance,
        balance,
        createAsset,
        findAccountsAsset,
        twitterProvider,
        setTwitterProvider,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
