import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

    api.post('/init/', (req, res) => {
		res.status(201)
		res.send('created!')
    })

    api.get ('/languages/', (req, res) => res.send(['German'/*, 'English'*/]))

    api.put ('/learner/:language/', (req, res) => {
        res.json({
            languageName: req.params.language
        })
    })

    api.get ('/frequency-words/', (req, res) => {
        res.send('this is the mock Frequency Word')
    })

    api.post ('/frequency-words/:answer', (req, res) => {
        var ok = '';
        if (req.params.answer === 'ok'){
            ok = 'y'
        }else if (req.params.answer === 'notok'){
            ok = 'n'
        }
        res.json({ answer: req.params.answer, some: ok })
    })

    api.get ('/onboarding-completed/', (req, res) => {
        res.status(200)
        res.send('204')
    })

    api.get ('/sentence/', (req, res) => {
        res.status(200)
        res.send('Mock Sentence')
    })

    api.post ('/sentence/:answer/', (req, res) => {
        var ok = '';
        if (req.params.answer === 'ok'){
            ok = 'y'
        }else if (req.params.answer === 'notok'){
            ok = 'n'
        }
        res.json({ answer: req.params.answer, some: ok })
    })

	return api;
}
