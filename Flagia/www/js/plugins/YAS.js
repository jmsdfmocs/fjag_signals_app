(function(global){
  global.Calc = {
    SpecialAtk: function(a, b){
      //a b �͌v�Z���Ŏg���Ă���̂Ɠ��l
      
      //�����ł͗�Ƃ��Đ����Ă��郁���o�[��atk�̍��v���_���[�W�Ƃ���
      var members = $gameParty.aliveMembers();
      var atk = 0;
      for(var i = 0; i < members.length; i++){
        atk += members[i].atk;
      }
      return atk - b.def;   //return�������l���v�Z���̌��ʂƂȂ�
    }
  };
})(this);