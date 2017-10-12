pragma solidity ^0.4.4;

contract Adoption{

  address[16] public adopters; //aunque esta declarada como public, desde fuera solo se puede leer y no modificar

  //Adopting a pet
  function adopt(uint petId) public returns (uint){
    require(petId >= 0 && petId <= 15);
    adopters[petId] = msg.sender; //msg.sender es el la direccion de la cartera que envia el token/dinero
    return petId;
  }

  //Retriving the adopters
  function getAdopters() public constant returns (address[16]){ // constant, no usa gas ya que no modifica los datos
    return adopters;
  }
}
