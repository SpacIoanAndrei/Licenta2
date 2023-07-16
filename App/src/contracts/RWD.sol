// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract RWD {
    string public name = 'Reward token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens, 24 zeros
    uint8 public decimals = 18;

    //CamelCase
    event Transfer (
        address indexed _from,
        address indexed _to,
        uint _value
    );
    //block.timestamp is a global variable that gives the current timestamp
    //index = max of 3 per event
    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint _value
    );
    mapping (address =>uint256) public balanceOf;
    mapping (address => mapping (address =>uint256)) public allowance;


    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer (address _to, uint256 _value) public returns (bool success) {
        //require that the value is greater or equal for transfer 
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    } 
    function transferFrom (address _from, address _to, uint256 _value) public returns (bool success) {
        //require that the value is greater or equal for transfer 
        require(balanceOf[msg.sender] >= _value);
        require(allowance[msg.sender][msg.sender] >= _value);


        balanceOf[ _from] -= _value;
        balanceOf[_to] += _value;
        allowance[ _from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}