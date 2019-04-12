package javaposse.jobdsl.plugin.actions

import hudson.Extension
import hudson.model.Action
import hudson.model.FreeStyleProject
import jenkins.model.TransientActionFactory
import org.jenkinsci.plugins.structs.describable.DescribableModel

import javax.annotation.Nonnull

@Extension
class DslGeneratorTransientActionFactory extends TransientActionFactory<FreeStyleProject> {
    @Override
    Class<FreeStyleProject> type() {
        FreeStyleProject
    }

    @Nonnull
    @Override
    Collection<? extends Action> createFor(@Nonnull FreeStyleProject target) {
        try {
            DescribableModel.of(FreeStyleProject.class)
            [new DslGeneratorAction(target)]
        } catch (IllegalArgumentException ignore) {
            []
        }
    }
}
