FUNCTION verifyUserCredential(user_id):
    # Step 1: Retrieve user hashed credential from backend
    user_credential_hash = DATABASE.get_user_hash(user_id)

    # Step 2: Connect to Ethereum blockchain
    web3 = CONNECT_TO_BLOCKCHAIN(provider_url)

    # Step 3: Load smart contract
    contract = web3.load_contract(
        address=SMART_CONTRACT_ADDRESS,
        abi=SMART_CONTRACT_ABI
    )

    # Step 4: Call smart contract's verification function
    is_valid = contract.functions.verifyCredential(user_credential_hash).call()

    # Step 5: Return result
    IF is_valid:
        RETURN "Credential Verified"
    ELSE:
        RETURN "Invalid Credential"

END FUNCTION
