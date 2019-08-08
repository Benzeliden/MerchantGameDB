$(document).ready(function()  {
  var $heroMenu           = "";
  var $itemMenu           = "";
  var $regionMenu         = "";
  var $toolMenu           = "";
  var $guideMenu          = "";
  var $communityMenu      = "";

  $heroMenu = [
    "<ul id='sub-menu-heroes'>",
      "<li><a href='#!/heroes/Warrior'>Warrior</a></li>",
      "<li><a href='#!/heroes/Rogue'>Rogue</a></li>",
      "<li><a href='#!/heroes/Mage'>Mage</a></li>",
      "<li><a href='#!/heroes/Berserker'>Berserker</a></li>",
      "<li><a href='#!/heroes/Cleric'>Cleric</a></li>",
      "<li><a href='#!/heroes/Assassin'>Assassin</a></li>",
      "<li><a href='#!/heroes/Paladin'>Paladin</a></li>",
      "<li><a href='#!/heroes/Dark Knight'>Dark Knight</a></li>",
      "<li><a href='#!/heroes/Bard'>Bard</a></li>",
    "</ul>"
  ].join("");

  $itemMenu = [
    "<ul id='sub-menu-heroes'>",
      "<li><a href='#!/items/weapons'>Weapons</a></li>",
      "<li><a href='#!/items/armors'>Armors</a></li>",
      "<li><a href='#!/items/trinkets'>Trinkets</a></li>",
      "<li><a href='#!/items/consumables'>Consumables</a></li>",
      "<li><a href='#!/items/materials'>Materials</a></li>",
    "</ul>"
  ].join("");

  $regionMenu = [
    "<ul id='sub-menu-zones'>",
      "<li><a href='#!/regios/Tuvale Forest'>Tuvale Forest</a></li>",
      "<li><a href='#!/regios/Yarsol Cove'>Yarsol Cove</a></li>",
      "<li><a href='#!/regios/Aldur Highlands'>Aldur Highlands</a></li>",
      "<li><a href='#!/regios/Vulkrum Badlands'>Vulkrum Badlands</a></li>",
      "<li><a href='#!/regios/Grimhal Volcano'>Grimhal Volcano</a></li>",
      "<li><a href='#!/regios/Frentir Chasm'>Frentir Chasm</a></li>",
    "</ul>"
  ].join("");

  $communityMenu = [
    "<ul id='sub-menu-community'>",
      "<li><a href='https://www.reddit.com/r/MerchantRPG/'>Reddit</a></li>",
    "</ul>"
  ].join("");

  $("#hero-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideDown( "fast" ).empty().append( $heroMenu );
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  $("#item-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideDown( "fast" ).empty().append( $itemMenu );
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  $("#region-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideDown( "fast" ).empty().append( $regionMenu );
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  $("#tool-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideUp( "fast" ).empty();
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  $("#guide-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideUp( "fast" ).empty();
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  $("#community-link").on('mouseenter', (function() {
    $("#sub-menu-hold").slideUp( "fast" ).empty();
    $("#navi-hold>ul>li>a.menu-hovered").removeClass("menu-hovered");
    $(this).addClass("menu-hovered");
  }));

  //Colapse menu when mouse leaves the menu
  $(".nav-menu-desktop").mouseleave(function() {

  });
})
