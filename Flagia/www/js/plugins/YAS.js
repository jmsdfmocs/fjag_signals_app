(function(global){
  global.Calc = {
    SpecialAtk: function(a, b){
      //a b は計算式で使っているのと同様
      
      //ここでは例として生きているメンバーのatkの合計をダメージとする
      var members = $gameParty.aliveMembers();
      var atk = 0;
      for(var i = 0; i < members.length; i++){
        atk += members[i].atk;
      }
      return atk - b.def;   //returnした数値が計算式の結果となる
    }
  };
})(this);