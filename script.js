document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-form');
    const previewContent = document.getElementById('preview-content');
    const addNoduleButton = document.getElementById('add-nodule');
    const noduleList = document.getElementById('nodule-list');
    const addLobeButton = document.getElementById('add-lobe');
    const lobeList = document.getElementById('lobe-list');
    const addLymphNodeButton = document.getElementById('add-lymph-node');
    const lymphNodeList = document.getElementById('lymph-node-list');
    const copyButton = document.getElementById('copy-report');
    let nodules = [];
    let lobes = [];
    let lymphNodes = [];


    // Copy report to clipboard
    copyButton.addEventListener('click', () => {
        const reportContent = document.getElementById('preview-content').innerText;
        navigator.clipboard.writeText(reportContent).then(() => {
            alert('Report copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy report: ', err);
            alert('Failed to copy report. Please try again.');
        });
    });
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Nodule functionality
    function getNoduleFormData() {
        const formData = new FormData(form);
        return {
            location: Array.from(formData.getAll('nodule-location')).join(', '),
            locationWithinLobe: Array.from(formData.getAll('location-within-lobe')).join(', '),
            size: {
                long: formData.get('nodule-size-long'),
                ap: formData.get('nodule-size-ap'),
                trans: formData.get('nodule-size-trans')
            },
            composition: formData.get('composition'),
            echogenicity: formData.get('echogenicity'),
            shape: formData.get('shape'),
            margin: formData.get('margin'),
            echogenicFoci: Array.from(formData.getAll('echogenic-foci')).join(', '),
            tiRadsScore: document.getElementById('ti-rads-score').value,
            recommendations: document.getElementById('recommendations').value
        };
    }

    addNoduleButton.addEventListener('click', () => {
        const nodule = getNoduleFormData();
        nodules.push(nodule);
        updateNoduleList();
        clearNoduleForm();
    });

    function updateNoduleList() {
        noduleList.innerHTML = '';
        nodules.forEach((nodule, index) => {
            const noduleItem = document.createElement('div');
            noduleItem.classList.add('nodule-item');
            noduleItem.innerHTML = `
                <h4>Nodule ${index + 1}</h4>
                <p><strong>Location:</strong> ${nodule.location}</p>
                <p><strong>Location within lobe:</strong> ${nodule.locationWithinLobe}</p>
                <p><strong>Size:</strong> ${nodule.size.long} x ${nodule.size.ap} x ${nodule.size.trans} cm</p>
                <p><strong>TI-RADS Score:</strong> ${nodule.tiRadsScore}</p>
                <button type="button" class="remove-nodule" data-index="${index}">Remove</button>
            `;
            noduleList.appendChild(noduleItem);
        });

        document.querySelectorAll('.remove-nodule').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                nodules.splice(index, 1);
                updateNoduleList();
            });
        });
    }

    function clearNoduleForm() {
        document.querySelectorAll('[name^="nodule-"], [name^="composition"], [name^="echogenicity"], [name^="shape"], [name^="margin"], [name^="echogenic-foci"], [name="location-within-lobe"]').forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        document.getElementById('total-points').value = '';
        document.getElementById('ti-rads-score').value = '';
        document.getElementById('recommendations').value = '';
    }

    // Lobe functionality
    function getLobeFormData() {
        const formData = new FormData(form);
        return {
            parts: Array.from(formData.getAll('thyroid-parts')).join(', '),
            appearance: Array.from(formData.getAll('lobe-appearance')).join(', '),
            size: {
                long: formData.get('lobe-size-long'),
                ap: formData.get('lobe-size-ap'),
                trans: formData.get('lobe-size-trans')
            }
        };
    }

    addLobeButton.addEventListener('click', () => {
        const lobe = getLobeFormData();
        lobes.push(lobe);
        updateLobeList();
        clearLobeForm();
    });

    function updateLobeList() {
        lobeList.innerHTML = '';
        lobes.forEach((lobe, index) => {
            const lobeItem = document.createElement('div');
            lobeItem.classList.add('lobe-item');
            lobeItem.innerHTML = `
                <h4>Lobe ${index + 1}</h4>
                <p><strong>Parts:</strong> ${lobe.parts}</p>
                <p><strong>Appearance:</strong> ${lobe.appearance}</p>
                <p><strong>Size:</strong> ${lobe.size.long} x ${lobe.size.ap} x ${lobe.size.trans} cm</p>
                <button type="button" class="remove-lobe" data-index="${index}">Remove</button>
            `;
            lobeList.appendChild(lobeItem);
        });

        document.querySelectorAll('.remove-lobe').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                lobes.splice(index, 1);
                updateLobeList();
            });
        });
    }

    function clearLobeForm() {
        document.querySelectorAll('[name^="thyroid-parts"], [name^="lobe-appearance"]').forEach(input => {
            input.checked = false;
        });
        document.querySelectorAll('[name^="lobe-size-"]').forEach(input => {
            input.value = '';
        });
    }

    // Lymph node functionality
    function getLymphNodeFormData() {
        const formData = new FormData(form);
        return {
            location: Array.from(formData.getAll('lymph-location')).join(', '),
            levels: Array.from(formData.getAll('lymph-level')).join(', '),
            size: formData.get('lymph-node-size') || 'Not specified'
        };
    }

    addLymphNodeButton.addEventListener('click', () => {
        const lymphNode = getLymphNodeFormData();
        lymphNodes.push(lymphNode);
        updateLymphNodeList();
        clearLymphNodeForm();
    });

    function updateLymphNodeList() {
        lymphNodeList.innerHTML = '';
        lymphNodes.forEach((lymphNode, index) => {
            const lymphNodeItem = document.createElement('div');
            lymphNodeItem.classList.add('lymph-node-item');
            lymphNodeItem.innerHTML = `
                <h4>Lymph Node ${index + 1}</h4>
                <p><strong>Location:</strong> ${lymphNode.location}</p>
                <p><strong>Levels:</strong> ${lymphNode.levels}</p>
                <p><strong>Size:</strong> ${lymphNode.size} cm</p>
                <button type="button" class="remove-lymph-node" data-index="${index}">Remove</button>
            `;
            lymphNodeList.appendChild(lymphNodeItem);
        });

        document.querySelectorAll('.remove-lymph-node').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                lymphNodes.splice(index, 1);
                updateLymphNodeList();
            });
        });
    }

    function clearLymphNodeForm() {
        document.querySelectorAll('[name^="lymph-location"], [name^="lymph-level"]').forEach(input => {
            input.checked = false;
        });
        document.getElementById('lymph-node-size').value = '';
    }

    // TI-RADS score calculation
    function updateTIRADS() {
        const formData = new FormData(form);
        let totalPoints = 0;

        totalPoints += parseInt(formData.get('composition').split('-')[1]) || 0;
        totalPoints += parseInt(formData.get('echogenicity').split('-')[1]) || 0;
        totalPoints += parseInt(formData.get('shape').split('-')[1]) || 0;
        totalPoints += parseInt(formData.get('margin').split('-')[1]) || 0;
        formData.getAll('echogenic-foci').forEach(foci => {
            totalPoints += parseInt(foci.split('-')[1]) || 0;
        });

        document.getElementById('total-points').value = totalPoints;

        let tiRadsScore;
        if (totalPoints === 0) tiRadsScore = 'TR1';
        else if (totalPoints >= 1 && totalPoints <= 2) tiRadsScore = 'TR2';
        else if (totalPoints === 3) tiRadsScore = 'TR3';
        else if (totalPoints >= 4 && totalPoints <= 6) tiRadsScore = 'TR4';
        else if (totalPoints >= 7) tiRadsScore = 'TR5';

        document.getElementById('ti-rads-score').value = tiRadsScore;

        const noduleSize = Math.max(
            parseFloat(document.getElementById('nodule-size-long').value) || 0,
            parseFloat(document.getElementById('nodule-size-ap').value) || 0,
            parseFloat(document.getElementById('nodule-size-trans').value) || 0
        );

        let recommendations = '';
        switch (tiRadsScore) {
            case 'TR1':
            case 'TR2':
                recommendations = 'No FNA or follow-up required.';
                break;
            case 'TR3':
                if (noduleSize >= 2.5) recommendations = 'FNA if ≥ 2.5 cm; Follow-up if ≥ 1.5 cm.';
                else if (noduleSize >= 1.5) recommendations = 'Follow-up may be appropriate.';
                else recommendations = 'No FNA or follow-up required.';
                break;
            case 'TR4':
                if (noduleSize >= 1.5) recommendations = 'FNA if ≥ 1.5 cm; Follow-up if ≥ 1 cm.';
                else if (noduleSize >= 1) recommendations = 'Follow-up may be appropriate.';
                else recommendations = 'No FNA or follow-up required.';
                break;
            case 'TR5':
                if (noduleSize >= 1) recommendations = 'FNA if ≥ 1 cm; Follow-up if ≥ 0.5 cm.';
                else if (noduleSize >= 0.5) recommendations = 'Follow-up may be appropriate.';
                else recommendations = 'No FNA or follow-up required.';
                break;
        }

        document.getElementById('recommendations').value = recommendations;
    }

    // Add event listeners to form elements for TI-RADS calculation
    const tiRadsInputs = form.querySelectorAll('[name^="composition"], [name^="echogenicity"], [name^="shape"], [name^="margin"], [name^="echogenic-foci"], [name^="nodule-size-"]');
    tiRadsInputs.forEach(input => {
        input.addEventListener('change', updateTIRADS);
    });

    // Form submission and report generation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        let report = '<h2>Findings</h2>';

        // Generate report for all lobes
        if (lobes.length > 0) {
            report += '<h3>Thyroid Lobes</h3>';
            lobes.forEach((lobe, index) => {
                report += `
                    <h4>Lobe ${index + 1}</h4>
                    <p><strong>Examined Parts:</strong> ${lobe.parts}</p>
                    <p><strong>Appearance:</strong> ${lobe.appearance}</p>
                    <p><strong>Lobe Size:</strong> ${lobe.size.long} x ${lobe.size.ap} x ${lobe.size.trans} cm</p>
                `;
            });
        } else {
            report += '<p>No lobes recorded.</p>';
        }

        // Generate report for all nodules
        if (nodules.length > 0) {
            report += '<h3>Thyroid Nodules</h3>';
            nodules.forEach((nodule, index) => {
                report += `
                    <h4>Nodule ${index + 1}</h4>
                    <p><strong>Location:</strong> ${nodule.location}</p>
                    <p><strong>Location within lobe:</strong> ${nodule.locationWithinLobe}</p>
                    <p><strong>Nodule Size:</strong> ${nodule.size.long} x ${nodule.size.ap} x ${nodule.size.trans} cm</p>
                    <p><strong>ACR TI-RADS Descriptors:</strong></p>
                    <ul>
                        <li>Composition: ${nodule.composition}</li>
                        <li>Echogenicity: ${nodule.echogenicity}</li>
                        <li>Shape: ${nodule.shape}</li>
                        <li>Margin: ${nodule.margin}</li>
                        <li>Echogenic Foci: ${nodule.echogenicFoci}</li>
                    </ul>
                    <p><strong>TI-RADS Score:</strong> ${nodule.tiRadsScore}</p>
                    <p><strong>Recommendations:</strong> ${nodule.recommendations}</p>
                `;
            });
        } else {
            report += '<p>No nodules recorded.</p>';
        }

        // Generate report for all lymph nodes
        if (lymphNodes.length > 0) {
            report += '<h3>Lymph Nodes</h3>';
            lymphNodes.forEach((lymphNode, index) => {
                report += `
                    <h4>Lymph Node ${index + 1}</h4>
                    <p><strong>Location:</strong> ${lymphNode.location}</p>
                    <p><strong>Levels:</strong> ${lymphNode.levels}</p>
                    <p><strong>Size:</strong> ${lymphNode.size} cm</p>
                `;
            });
        } else {
            report += '<p>No lymph nodes recorded.</p>';
        }
        // General findings
        report += '<h3>Impression</h3>';
        const generalFindings = Array.from(formData.getAll('impression-general'));
        if (generalFindings.length > 0) {
            report += `<h4>General Findings:</h4><ul>`;
            generalFindings.forEach(finding => {
                let findingText = '';
                switch (finding) {
                    case 'normal': findingText = 'Normal thyroid sonogram'; break;
                    case 'small-nodules': findingText = 'Small thyroid nodules'; break;
                    case 'multinodular': findingText = 'Multinodular goiter'; break;
                    case 'hashimotos': findingText = "Consistent with Hashimoto's (lymphocytic) thyroiditis"; break;
                    case 'stability': findingText = 'Nodules show stability over at least 5 years'; break;
                    case 'no-followup': findingText = 'No imaging follow up is recommended unless clinically indicated'; break;
                }
                report += `<li>${findingText}</li>`;
            });
            report += `</ul>`;
        }

        // Biopsy considerations
        const biopsyNodules = Array.from(formData.getAll('biopsy-nodules'));
        if (biopsyNodules.length > 0) {
            report += `<h4>Consider biopsy of the following nodules:</h4>`;
            report += `<p>Nodule ${biopsyNodules.join(', ')}</p>`;
        }

        // Additional findings
        const additionalFindings = formData.get('additional-findings');
        if (additionalFindings) {
            report += `<h4>Additional Findings:</h4>`;
            report += `<p>${additionalFindings}</p>`;
        }
        previewContent.innerHTML = report;
    });
});
