ruleset {
    ruleset('file:config/codenarc/rules.groovy') {
        // that's OK for examples
        exclude 'NoDef'
        // several DSL methods have a signature like a setter
        exclude 'UnnecessarySetter'
    }
}
