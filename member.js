function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'templates/skills-member.html',
    scope: {
      member: '=',
      skills: '='
    },
    controller: function($scope) {
      $scope.getSkill = function(id) {
        return $scope.skills.filter(function(skill) {
          return skill.id === id;
        })[0];
      };
    }
  };
}