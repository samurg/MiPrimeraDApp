App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-adopt').attr('data-price', data[i].price);
        petTemplate.find('.btn-return').attr('data-id', data[i].id);
        petTemplate.find('.btn-return').attr('data-price', data[i].price);
        petTemplate.find('.pet-price').text(data[i].price);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }   else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract.
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-return', App.handleReturn);
  },

  handleAdopt: function() {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    var petPrice = parseInt($(event.target).data('price'));
    var adoptionInstance;
    var petPriceWei = web3.toWei(petPrice, 'ether');
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from: account, value: petPriceWei});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleReturn: function(){
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    var petPrice = parseInt($(event.target).data('price'));
    var adoptionInstance;
    var petPriceWei = web3.toWei(petPrice, 'ether');
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.devolver(petId,{from: account});
      }).then(function(result) {
        if(result == true) alert("Devuelto");
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('btn-adopt').text('Success...').attr('disabled', true);
        }
      }
      return App.obtenerBalance();
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  obtenerBalance: function(){
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getBalance.call();
   }).then(function(bal) {
      var balanceTemplate = $('#balanceTemplate');
      balanceTemplate.find('.balance').text(web3.fromWei(bal,'ether'));
    }).catch(function(err) {
      console.log(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
