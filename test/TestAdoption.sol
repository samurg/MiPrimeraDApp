pragma solidity ^0.4.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
	Adoption adoption = Adoption(DeployedAddresses.Adoption());

	function testUserCanAdoptPet(){
		uint returnedId = adoption.adopt(8,2);
		uint balance = adoption.getBalance();
		uint expected = 8;

		Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
		Assert.equal(balance, 2, "Probar que el balance es el correcto");
	}

	function testGetAdopterAddressByPetId(){
		address expected = this;

		address adopter = adoption.adopters(8);

		Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded");

	}

	function testGetAdopterAddressByPetIdInArray(){
		address expected = this;

		address[16] memory adopters = adoption.getAdopters();

		Assert.equal(adopters[8], expected, "Owner of pet Id 8 should be recorded.");
	}

}
