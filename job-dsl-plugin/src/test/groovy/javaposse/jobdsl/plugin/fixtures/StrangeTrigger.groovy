package javaposse.jobdsl.plugin.fixtures

import hudson.Extension
import hudson.model.Descriptor
import hudson.model.Job
import hudson.triggers.Trigger
import org.kohsuke.stapler.DataBoundConstructor

class StrangeTrigger extends Trigger<Job> {
    @DataBoundConstructor
    StrangeTrigger() {
    }

    @Extension
    public static final Descriptor<Trigger<?>> DESCRIPTOR = new DummyTrigger.DescriptorImpl(StrangeTrigger)
}
