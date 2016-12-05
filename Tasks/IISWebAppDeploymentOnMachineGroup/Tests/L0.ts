import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

describe('IISWebsiteDeploymentOnMachineGroup test suite', function() {
     var taskSrcPath = path.join(__dirname, '..','deployiiswebapp.js');

     before((done) => {
        done();
    });
    after(function() {

    });

    it('Runs successfully with default inputs', (done:MochaDone) => {
        let tp = path.join(__dirname, 'L0WindowsDefault.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

		assert(tr.invokedToolCount == 2, 'should have invoked tool once');
        assert(tr.stderr.length == 0 || tr.errorIssues.length, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
        done();
    });

	it('Runs successfully with all other inputs', (done) => {
        let tp = path.join(__dirname, 'L0WindowsAllInput.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

		assert(tr.invokedToolCount == 2, 'should have invoked tool twice');
        assert(tr.stderr.length == 0 && tr.errorIssues.length == 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');
        done();
    });
    
	it('Fails if msdeploy cmd fails to execute', (done) => {
        let tp = path.join(__dirname, 'L0WindowsFailDefault.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
		tr.run();
		
		var expectedErr = 'Error: Error: cmd failed with return code: 1';
		assert(tr.invokedToolCount == 2, 'should have invoked tool twice');
        assert(tr.errorIssues.length > 0 || tr.stderr.length > 0, 'should have written to stderr');
        assert(tr.stdErrContained(expectedErr) || tr.createdErrorIssue(expectedErr), 'E should have said: ' + expectedErr); 
        assert(tr.failed, 'task should have failed');
        done();
    });

    it('Runs successfully with parameter file present in package', (done) => {
        let tp = path.join(__dirname, 'L0WindowsParamFileinPkg.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
		tr.run();
		
		assert(tr.invokedToolCount == 2, 'should have invoked tool twice');
        assert(tr.stderr.length == 0 && tr.errorIssues.length == 0, 'should not have written to stderr'); 
        assert(tr.succeeded, 'task should have succeeded');
        done();
    });

    it('Fails if parameters file provided by user is not present', (done) => {
        let tp = path.join(__dirname, 'L0WindowsFailSetParamFile.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
		tr.run();
		
		assert(tr.invokedToolCount == 0, 'should not have invoked any tool');
        assert(tr.stderr.length > 0 || tr.errorIssues.length > 0, 'should have written to stderr');
        var expectedErr = 'Error: loc_mock_SetParamFilenotfound0'; 
        assert(tr.stdErrContained(expectedErr) || tr.createdErrorIssue(expectedErr), 'should have said: ' + expectedErr);
        assert(tr.failed, 'task should have succeeded');
        done();
    });

    it('Fails if more than one package matched with specified pattern', (done) => {
        let tp = path.join(__dirname, 'L0WindowsManyPackage.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
		tr.run();
		
		assert(tr.invokedToolCount == 0, 'should not have invoked any tool');
        assert(tr.stderr.length > 0 || tr.errorIssues.length > 0, 'should have written to stderr');
        var expectedErr = 'Error: loc_mock_MorethanonepackagematchedwithspecifiedpatternPleaserestrainthesearchpatern'; 
        assert(tr.stdErrContained(expectedErr) || tr.createdErrorIssue(expectedErr), 'should have said: ' + expectedErr); 
        assert(tr.failed, 'task should have failed');
        done();
    });

    it('Fails if package or folder name is invalid', (done) => {
        let tp = path.join(__dirname, 'L0WindowsNoPackage.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
		tr.run();
		
		assert(tr.invokedToolCount == 0, 'should not have invoked any tool');
        assert(tr.stderr.length > 0 || tr.errorIssues.length > 0, 'should have written to stderr');
        var expectedErr = 'Error: loc_mock_Nopackagefoundwithspecifiedpattern'; 
        assert(tr.stdErrContained(expectedErr) || tr.createdErrorIssue(expectedErr), 'should have said: ' + expectedErr); 
        assert(tr.failed, 'task should have failed');
        done();
    });

    it('Runs successfully with JSON variable substitution', (done:MochaDone) => {
        let tp = path.join(__dirname, 'L0JsonVarSub.js');
        let tr : ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
		console.log(tr.stdout);
		console.log(tr.stderr);
        assert(tr.invokedToolCount == 2, 'should have invoked tool twice');
        assert(tr.stderr.length == 0 || tr.errorIssues.length, 'should not have written to stderr');
        assert(tr.stdout.search('JSON - eliminating object variables validated') > 0, 'JSON - eliminating object variables validation error');
        assert(tr.stdout.search('JSON - simple string change validated') > 0,'JSON -simple string change validation error' );
        assert(tr.stdout.search('JSON - system variable elimination validated') > 0, 'JSON -system variable elimination validation error');
        assert(tr.stdout.search('JSON - special variables validated') > 0, 'JSON - special variables validation error');
        assert(tr.stdout.search('JSON - variables with dot character validated') > 0, 'JSON varaibles with dot character validated');
        assert(tr.succeeded, 'task should have succeeded');
        done();
    });
});
